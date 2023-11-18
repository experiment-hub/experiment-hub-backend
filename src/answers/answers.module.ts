import { Module } from '@nestjs/common';
import { AnswerController } from 'src/answers/answers.controller';
import { AnswerService } from 'src/answers/answers.service';
@Module({
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
