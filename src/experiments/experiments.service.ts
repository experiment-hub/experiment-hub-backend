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
    const mongoExperiment = await this.mongoPrisma.experiment.create({
      data: {
        slug,
        nodes: [],
        views: [],
      },
    });

    const { id } = mongoExperiment;

    const postgresExperiment = await this.postgresPrisma.experiment.create({
      data: {
        name,
        slug,
        description,
        coverImage,
        mongoId: id,
        teamId,
      },
    });

    return { mongoExperiment, postgresExperiment };
  }

  async findAll() {
    const postgresExperiments = await this.postgresPrisma.experiment.findMany({
      include: {
        team: {
          select: {
            pk: true,
            name: true,
            description: true,
          },
        },
      },
    });

    const mongoExperiments = await this.mongoPrisma.experiment.findMany({
      select: {
        id: true,
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    // merge the two experiments arrays
    const experiments = postgresExperiments.map((postgresExperiment) => {
      const mongoExperiment = mongoExperiments.find(
        (mongoExperiment) => mongoExperiment.id === postgresExperiment.mongoId,
      );

      return {
        ...postgresExperiment,
        ...mongoExperiment,
      };
    });

    return experiments;
  }

  async findByTeamId(teamId: number) {
    const postgresExperiments = await this.postgresPrisma.experiment.findMany({
      where: { teamId },
    });

    return postgresExperiments;
  }

  async findOne(id: number) {
    const postgresExperiment = await this.postgresPrisma.experiment.findUnique({
      where: { pk: id },
      include: {
        team: {
          select: {
            pk: true,
            name: true,
            description: true,
          },
        },
      },
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

  async createView(id: number, createViewDto: CreateViewDto) {
    const { mongoId } = await this.postgresPrisma.experiment.findUnique({
      where: { pk: id },
    });

    const updatedExperiment = await this.mongoPrisma.experiment.update({
      where: { id: mongoId },

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

  async updateView(id: number, viewSlug: string, updateViewDto: UpdateViewDto) {
    const { mongoId } = await this.postgresPrisma.experiment.findUnique({
      where: { pk: id },
    });

    const updatedExperiment = await this.mongoPrisma.experiment.update({
      where: { id: mongoId },
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

  async updateNodes(id: number, updateNodesDto: UpdateNodesDto) {
    const { mongoId } = await this.postgresPrisma.experiment.findUnique({
      where: { pk: id },
    });

    const updatedExperiment = await this.mongoPrisma.experiment.update({
      where: { id: mongoId },
      data: {
        nodes: {
          set: updateNodesDto.nodes,
        },
      },
    });

    return updatedExperiment;
  }

  async update(id: number, updateExperimentDto: UpdateExperimentDto) {
    const { name, slug, coverImage, description, teamId } = updateExperimentDto;

    const postgresExperiment = await this.postgresPrisma.experiment.update({
      where: { pk: id },
      data: {
        name,
        slug,
        description,
        coverImage,
      },
      include: {
        team: {
          select: {
            pk: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return { postgresExperiment };
  }

  async remove(id: number) {
    const postgresExperiment = await this.postgresPrisma.experiment.delete({
      where: { pk: id },
    });

    const mongoExperiment = await this.mongoPrisma.experiment.delete({
      where: { id: postgresExperiment.mongoId },
    });

    return {
      postgresExperiment,
      mongoExperiment,
    };
  }
}
