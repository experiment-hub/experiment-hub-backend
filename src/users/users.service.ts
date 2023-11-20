import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const roundsOfHashing = +process.env.ROUNDS;

@Injectable()
export class UsersService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: number) {
    const { password, ...user } = await this.prisma.user.findUnique({
      where: { pk: id },
    });
    return user;
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async findUserTeams(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { pk: id },
      include: {
        teams: {
          select: {
            team: {
              select: {
                pk: true,
                name: true,
                slug: true,
                coverImage: true,
                description: true,
                users: {
                  select: {
                    user: {
                      select: {
                        pk: true,
                        email: true,
                        name: true,
                        username: true,
                        avatar: true,
                        organization: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return user.teams.map((team) => ({
      ...team.team,
      users: team.team.users.map((user) => user.user),
    }));
  }

  async findByUsername(username: string) {
    const { password, ...user } = await this.prisma.user.findFirst({
      where: { username },
      include: {
        teams: {
          select: {
            team: true,
          },
        },
      },
    });
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.name,
        organization: createUserDto.organization,
        username: createUserDto.username,
        avatar: '',
        teams: {
          create: [
            {
              team: {
                create: {
                  name: `${createUserDto.name}'s Team`,
                  slug: `${createUserDto.name
                    .toLowerCase()
                    .replace(' ', '-')}-team`,
                },
              },
            },
          ],
        },
      },
    });

    return { user };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    const { password, ...user } = await this.prisma.user.update({
      where: { pk: id },
      data: updateUserDto,
    });

    return user;
  }

  async listUsers() {
    return this.prisma.user.findMany();
  }
}
