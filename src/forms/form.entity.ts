import { ApiProperty } from '@nestjs/swagger';
import { Form } from '@prisma/postgres/client';

export class FormEntity implements Form {
  constructor(partial: Partial<FormEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  pk: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  teamId: number;

  @ApiProperty()
  formMongoId: string;
}
