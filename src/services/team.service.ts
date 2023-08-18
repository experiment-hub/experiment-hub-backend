import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres/client';

class CreateTeamDto {
  name: string;
  description: string;
  userId: number;
}

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
      throw error; // Rethrow the error to be caught by the controller
    }
  }
}
