import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { AnswerService } from '../services/answer.service';
import { CreateAnswerDto, UpdateAnswerDto } from 'src/dtos/answer.dto';

@Controller('teams/:teamId/forms/:id/answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  async createAnswer(
    @Body() createAnswerDto: CreateAnswerDto,
    @Param('id') formId: string,
    @Param('teamId') teamId: string,
  ) {
    try {
      const newAnswer = await this.answerService.createAnswer(
        formId,
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

  @Get()
  async listAnswers(
    @Param('id') formId: string,
    @Param('teamId') teamId: string,
  ) {
    try {
      const answers = await this.answerService.listAnswers(formId);
      return answers;
    } catch (error) {
      throw new HttpException(
        'An error occurred while finding answers.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
