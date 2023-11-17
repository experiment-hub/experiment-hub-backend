import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExperimentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  slug: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  coverImage: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  teamId: number;
}
