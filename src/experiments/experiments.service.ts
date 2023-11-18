import { Injectable } from '@nestjs/common';
import { PrismaClient as PostgresClient } from '@prisma/postgres/client';
import { PrismaClient as MongoClient } from '@prisma/mongo/client';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';

@Injectable()
export class ExperimentsService {
  private readonly postgresPrisma: PostgresClient;
  private readonly mongoPrisma: MongoClient;

  constructor() {
    this.postgresPrisma = new PostgresClient();
    this.mongoPrisma = new MongoClient();
  }

  async create(createExperimentDto: CreateExperimentDto) {
    const { name, slug, coverImage, description, teamId } = createExperimentDto;
    try {
      const mongoExperiment = await this.mongoPrisma.experiment.create({
        data: {
          slug,
          nodes: [],
          views: [],
        },
      });

      console.log('Mongo Form:', mongoExperiment);

      const { id } = mongoExperiment;

      const postgresExperiment = await this.postgresPrisma.experiment.create({
        data: {
          name,
          slug,
          description,
          coverImage,
          mongoId: id,
          teamId: +teamId,
        },
      });

      return { mongoExperiment, postgresExperiment };
    } catch (error) {
      throw error; // Rethrow the error to be caught by the controller
    }
  }

  async findAll() {
    const postgresExperiments = await this.postgresPrisma.experiment.findMany();
    return postgresExperiments;
  }

  async findByTeamId(teamId: number) {
    // get only the postgres experiments for the team
    const postgresExperiments = await this.postgresPrisma.experiment.findMany({
      where: { teamId },
    });

    return postgresExperiments;
  }

  async findOne(id: number) {
    const postgresExperiment = await this.postgresPrisma.experiment.findUnique({
      where: { pk: id },
    });
    const mongoExperiment = await this.mongoPrisma.experiment.findUniqueOrThrow(
      {
        where: {
          id: postgresExperiment.mongoId,
        },
      },
    );

    return { postgresExperiment, mongoExperiment };
  }

  update(id: number, updateExperimentDto: UpdateExperimentDto) {
    return `This action updates a #${id} experiment`;
  }

  remove(id: number) {
    return `This action removes a #${id} experiment`;
  }
}
