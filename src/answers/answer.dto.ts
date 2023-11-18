import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @ApiProperty()
  body: Record<string, any>;
}

export class UpdateAnswerDto {
  @ApiProperty()
  content?: string;

  @ApiProperty()
  body?: Record<string, any>;
}
