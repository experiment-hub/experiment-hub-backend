import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/mongo/client';
import { CreateAnswerDto, UpdateAnswerDto } from 'src/answers/answer.dto';

@Injectable()
export class AnswerService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createAnswer(experimentId: string, createAnswerDto: CreateAnswerDto) {
    try {
      const newAnswer = await this.prisma.answer.create({
        data: {
          ...createAnswerDto,
          experimentId,
        },
      });
      return newAnswer;
    } catch (error) {
      throw error;
    }
  }

  async updateAnswer(answerId: string, updateAnswerDto: UpdateAnswerDto) {
    try {
      const updatedAnswer = await this.prisma.answer.update({
        where: { id: answerId },
        data: updateAnswerDto,
      });
      return updatedAnswer;
    } catch (error) {
      throw error;
    }
  }

  async getAnswerById(answerId: string) {
    try {
      const answer = await this.prisma.answer.findUnique({
        where: { id: answerId },
      });
      return answer;
    } catch (error) {
      throw error;
    }
  }

  async listAnswers(experimentId: string) {
    try {
      const answers = await this.prisma.answer.findMany({
        where: { experimentId },
      });
      return answers;
    } catch (error) {
      throw error;
    }
  }
}
