import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres/client';
import { CreateTeamDto, UpdateTeamDto } from './team.dto';
@Injectable()
export class TeamService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    const newTeam = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        description: createTeamDto.description,
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

  async updateTeam(id: number, updateTeamDto: UpdateTeamDto) {
    const updatedTeam = await this.prisma.team.update({
      where: { pk: id },
      data: updateTeamDto,
    });
    return updatedTeam;
  }

  async getTeamById(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { pk: id },
      include: {
        users: {
          select: {
            user: true,
          },
        },
        experiments: true,
      },
    });
    return team;
  }

  async getTeamMembers(id: number) {
    const team = await this.prisma.team.findUnique({
      where: { pk: id },
      include: {
        users: {
          select: {
            user: true,
          },
        },
      },
    });
    return team.users;
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

  async listTeams() {
    const teams = await this.prisma.team.findMany({
      include: {
        users: {
          select: {
            user: true,
          },
        },
        experiments: true,
      },
    });
    return teams;
  }
}
