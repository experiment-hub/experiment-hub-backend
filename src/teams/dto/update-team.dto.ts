import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTeamDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  members: string[];
}
