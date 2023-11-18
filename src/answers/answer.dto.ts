import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @ApiProperty()
  body: Record<string, any>;
}

export class UpdateAnswerDto {
  @ApiProperty()
  body?: Record<string, any>;
}
