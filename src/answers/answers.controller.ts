import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateAnswerDto, UpdateAnswerDto } from 'src/answers/answer.dto';
import { AnswerService } from './answers.service';

@Controller('experiments/:id/answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get()
  async listAnswers(@Param('id') experimentId: string) {
    try {
      const answers = await this.answerService.listAnswers(experimentId);
      return answers;
    } catch (error) {
      throw new HttpException(
        'An error occurred while finding answers.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createAnswer(
    @Body() createAnswerDto: CreateAnswerDto,
    @Param('id') experimentId: string,
  ) {
    try {
      const newAnswer = await this.answerService.createAnswer(
        experimentId,
        createAnswerDto,
      );
      return newAnswer;
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the answer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':answerId')
  async updateAnswer(
    @Param('answerId') answerId: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    try {
      const updatedAnswer = await this.answerService.updateAnswer(
        answerId,
        updateAnswerDto,
      );
      return updatedAnswer;
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the answer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':answerId')
  async getAnswer(@Param('answerId') answerId: string) {
    try {
      const answer = await this.answerService.getAnswerById(answerId);
      return answer;
    } catch (error) {
      throw new HttpException(
        'An error occurred while finding the answer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
