import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/postgres/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly prisma: PrismaClient;

  constructor(private configService: ConfigService) {
    this.prisma = new PrismaClient();
  }

  async findById(id: number) {
    const record = await this.prisma.user.findUnique({
      where: { pk: id },
    });

    if (record === null) {
      throw new Error('User not found.');
    } else {
      const { password, ...user } = record;
      return user;
    }
  }

  async findBySlug(slug: string) {
    const record = await this.prisma.user.findUnique({
      where: { username: slug },
    });

    if (record === null) {
      throw new Error('User not found.');
    } else {
      const { password, ...user } = record;
      return user;
    }
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
      parseInt(this.configService.get<string>('ROUNDS')),
    );

    createUserDto.password = hashedPassword;

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.name,
        organization: createUserDto.organization,
        username: createUserDto.username,
        avatar: createUserDto.avatar || '',
      },
    });

    return { user };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        parseInt(this.configService.get<string>('ROUNDS')),
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
