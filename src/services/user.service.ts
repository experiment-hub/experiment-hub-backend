import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres/client';

@Injectable()
export class UserService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
          type: createUserDto.type,
        },
      });
      return newUser;
    } catch (error) {
      throw error; // Rethrow the error to be caught by the controller
    }
  }
}

class CreateUserDto {
  email: string;
  password: string;
  type: UserType;
}

enum UserType {
  SCIENTIST = 'SCIENTIST',
  REGULAR = 'REGULAR',
}
