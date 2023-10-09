import { Module } from '@nestjs/common';
import { AnswerController } from 'src/controllers/answer.controller';
import { AnswerService } from 'src/services/answer.service';
@Module({
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
