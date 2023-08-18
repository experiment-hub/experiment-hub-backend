import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres/client';

@Injectable()
export class TeamUserService {
  constructor(private readonly prisma: PrismaClient) {}

  async createTeamUsers(teamId: number, userIds: number[]) {
    try {
      const teamUsersData = userIds.map((userId) => {
        return { userId, teamId };
      });
      const newTeamUsers = await this.prisma.teamUser.createMany({
        data: teamUsersData,
      });
      return newTeamUsers;
    } catch (error) {
      throw error; // Rethrow the error to be caught by the controller
    }
  }
}
