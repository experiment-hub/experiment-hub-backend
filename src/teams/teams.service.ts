import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres/client';
import { CreateTeamDto, UpdateTeamDto } from 'src/teams/team.dto';
@Injectable()
export class TeamService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async updateTeam(id: number, updateTeamDto: UpdateTeamDto) {
    try {
      const updatedTeam = await this.prisma.team.update({
        where: { pk: id },
        data: updateTeamDto,
      });
      return updatedTeam;
    } catch (error) {
      throw error;
    }
  }

  async getTeamById(id: number) {
    try {
      const team = await this.prisma.team.findUnique({
        where: { pk: id },
      });
      return team;
    } catch (error) {
      throw error;
    }
  }

  async listTeams(userId?: number) {
    try {
      const teams = await this.prisma.team.findMany({
        where: userId ? { users: { some: { userId } } } : {},
      });
      return teams;
    } catch (error) {
      throw error;
    }
  }
}
