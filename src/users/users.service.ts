import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from 'src/users/user.dto';

const roundsOfHashing = +process.env.ROUNDS;

@Injectable()
export class UsersService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: { startsWith: username } },
    });
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        roundsOfHashing,
      );

      createUserDto.password = hashedPassword;

      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
          name: createUserDto.name,
          organization: createUserDto.organization,
        },
      });

      // Create a new team for the user using the user's name as the team's name
      const newTeam = await this.prisma.team.create({
        data: {
          name: `${createUserDto.name}'s Team`,
          users: {
            create: [
              {
                userId: newUser.pk,
              },
            ],
          },
        },
      });

      return { newUser, newTeam };
    } catch (error) {
      throw error; // Rethrow the error to be caught by the controller
    }
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { pk: id } });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { pk: id },
      data: updateUserDto,
    });
    return updatedUser;
  }

  async listUsers() {
    return this.prisma.user.findMany();
  }
}
