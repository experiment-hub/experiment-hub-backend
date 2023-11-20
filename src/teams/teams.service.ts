import { Injectable } from '@nestjs/common';
import { PrismaClient as MongoClient } from '@prisma/mongo/client';
import { PrismaClient as PostgresClient } from '@prisma/postgres/client';
import { CreateTeamDto } from './dto/create-team.dto';

const userSelector = {
  select: {
    pk: true,
    email: true,
    name: true,
    username: true,
    avatar: true,
    organization: true,
  },
};

@Injectable()
export class TeamsService {
  private readonly postgresPrisma: PostgresClient;
  private readonly mongoPrisma: MongoClient;

  constructor() {
    this.postgresPrisma = new PostgresClient();
    this.mongoPrisma = new MongoClient();
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    const newTeam = await this.postgresPrisma.team.create({
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
    const { users, ...team } = await this.postgresPrisma.team.findUnique({
      where: { pk: id },
      include: {
        users: {
          select: {
            user: userSelector,
          },
        },
      },
    });

    const experiments = await this.getTeamExperiments(id);

    return {
      ...team,
      users: users.map((user) => user.user),
      experiments,
    };
  }

  async getTeamMembers(id: number) {
    const team = await this.postgresPrisma.team.findUnique({
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
    const team = await this.postgresPrisma.team.findUnique({
      where: { pk: id },
      include: {
        experiments: {
          select: {
            pk: true,
            name: true,
            slug: true,
            description: true,
            coverImage: true,
            mongoId: true,
            team: {
              select: {
                pk: true,
                name: true,
                description: true,
                users: {
                  select: {
                    user: {
                      select: {
                        email: true,
                        name: true,
                        username: true,
                        avatar: true,
                        organization: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const postgresExperiments = team.experiments;

    const mongoExperiments = await this.mongoPrisma.experiment.findMany({
      where: {
        id: { in: team.experiments.map((experiment) => experiment.mongoId) },
      },
      select: {
        id: true,
        nodes: true,
        views: true,
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    const experiments = postgresExperiments.map((postgresExperiment) => {
      const mongoExperiment = mongoExperiments.find(
        (mongoExperiment) => mongoExperiment.id === postgresExperiment.mongoId,
      );

      return {
        ...postgresExperiment,
        team: {
          ...postgresExperiment.team,
          users: postgresExperiment.team.users.map((user) => user.user),
        },
        nodes: mongoExperiment.nodes,
        views: mongoExperiment.views,
        answers: mongoExperiment._count.answers,
      };
    });

    return experiments;
  }

  async deleteTeam(id: number) {
    const members = await this.postgresPrisma.teamUser.deleteMany({
      where: {
        teamId: id,
      },
    });

    const team = await this.postgresPrisma.team.delete({
      where: { pk: id },
    });

    return team;
  }

  async listTeams() {
    const teams = await this.postgresPrisma.team.findMany({
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
