import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsJSON()
  body: Record<string, any>;
}

// export class UpdateAnswerDto {
//   @ApiProperty()
//   body?: Record<string, any>;
// }
