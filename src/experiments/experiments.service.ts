import { Injectable } from '@nestjs/common';
import { PrismaClient as MongoClient } from '@prisma/mongo/client';
import { PrismaClient as PostgresClient } from '@prisma/postgres/client';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { UpdateNodesDto } from './dto/update-nodes.dto';
import { UpdateViewDto } from './dto/update-view.dto';

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

  async createView(id: string, createViewDto: CreateViewDto) {
    const updatedExperiment = await this.mongoPrisma.experiment.update({
      where: { id: id },

      data: {
        views: {
          push: {
            name: createViewDto.name,
            slug: createViewDto.slug,
            description: createViewDto.description,
            widgets: [],
          },
        },
      },
    });

    return updatedExperiment;
  }

  async updateView(id: string, viewSlug: string, updateViewDto: UpdateViewDto) {
    const updatedExperiment = await this.mongoPrisma.experiment.update({
      where: { id: id },
      data: {
        views: {
          updateMany: {
            where: {
              slug: viewSlug,
            },
            data: {
              widgets: {
                set: updateViewDto.widgets,
              },
            },
          },
        },
      },
    });

    return updatedExperiment;
  }

  async updateNodes(id: string, updateNodesDto: UpdateNodesDto) {
    const updatedExperiment = await this.mongoPrisma.experiment.update({
      where: { id: id },

      data: {
        nodes: {
          set: updateNodesDto.nodes,
        },
      },
    });

    return updatedExperiment;
  }

  update(id: number, updateExperimentDto: UpdateExperimentDto) {
    return `This action updates a #${id} experiment`;
  }

  remove(id: number) {
    return `This action removes a #${id} experiment`;
  }
}
