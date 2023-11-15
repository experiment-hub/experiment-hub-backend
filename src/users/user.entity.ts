import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/postgres/client';
import { Exclude } from 'class-transformer';
import { UserType } from 'src/users/user.enum';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  pk: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  type: UserType;

  @Exclude()
  password: string;
}
