import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres/client';
import { CreateTeamDto } from './dto/create-team.dto';

const userSelector = {
  select: {
    pk: true,
    username: true,
    name: true,
    avatar: true,
  },
};

@Injectable()
export class TeamsService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    const newTeam = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        description: createTeamDto.description,
        slug: createTeamDto.slug,
        coverImage: createTeamDto.coverImage,
        users: {
          create: [
            {
              userId: createTeamDto.userId,
            },
          ],
        },
      },
    });
    return newTeam;
  }

  // async updateTeam(id: number, updateTeamDto: UpdateTeamDto) {
  //   const updatedTeam = await this.prisma.team.update({
  //     where: { pk: id },
  //     data: updateTeamDto,
  //   });
  //   return updatedTeam;
  // }

  async getTeamById(id: number) {
    const { users, ...team } = await this.prisma.team.findUnique({
      where: { pk: id },
      include: {
        users: {
          select: {
            user: userSelector,
          },
        },
        experiments: true,
      },
    });

    return {
      ...team,
      users: users.map((user) => user.user),
    };
  }

  async getTeamMembers(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { pk: id },
      include: {
        users: {
          select: {
            user: userSelector,
          },
        },
      },
    });
    return team.users.map((user) => user.user);
  }

  async getTeamExperiments(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { pk: id },
      include: {
        experiments: true,
      },
    });
    return team.experiments;
  }

  async deleteTeam(id: number) {
    const members = await this.prisma.teamUser.deleteMany({
      where: {
        teamId: id,
      },
    });

    const team = await this.prisma.team.delete({
      where: { pk: id },
    });
    
    return team;
  }

  async listTeams() {
    const teams = await this.prisma.team.findMany({
      include: {
        users: {
          select: {
            user: userSelector,
          },
        },
        experiments: true,
      },
    });

    return teams.map(({ users, ...team }) => {
      return {
        ...team,
        users: users.map((user) => user.user),
      };
    });
  }
}
