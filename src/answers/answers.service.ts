import { Injectable } from '@nestjs/common';
import { PrismaClient as MongoClient } from '@prisma/mongo/client';
import { PrismaClient as PostgresClient } from '@prisma/postgres/client';
import { CreateAnswerDto } from 'src/answers/answer.dto';

@Injectable()
export class AnswerService {
  private readonly postgresPrisma: PostgresClient;
  private readonly mongoPrisma: MongoClient;

  constructor() {
    this.postgresPrisma = new PostgresClient();
    this.mongoPrisma = new MongoClient();
  }

  async createAnswer(id: number, createAnswerDto: CreateAnswerDto) {
    const { mongoId: experimentId } =
      await this.postgresPrisma.experiment.findUnique({
        where: { pk: id },
      });
    const newAnswer = await this.mongoPrisma.answer.create({
      data: {
        ...createAnswerDto,
        experimentId,
      },
    });
    return newAnswer;
  }

  async updateAnswer(
    id: number,
    answerId: string,
    updateAnswerDto: CreateAnswerDto,
  ) {
    try {
      const updatedAnswer = await this.mongoPrisma.answer.update({
        where: { id: answerId },
        data: updateAnswerDto,
      });
      return updatedAnswer;
    } catch (error) {
      throw error;
    }
  }

  async getAnswerById(answerId: string) {
    const answer = await this.mongoPrisma.answer.findUnique({
      where: { id: answerId },
    });
    return answer;
  }

  async listAnswers(id: number) {
    const { mongoId: experimentId } =
      await this.postgresPrisma.experiment.findUnique({
        where: { pk: id },
      });

    const answers = await this.mongoPrisma.answer.findMany({
      where: { experimentId },
    });

    return answers;
  }
}
