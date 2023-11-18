import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/postgres/client';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from '../auth/entity/auth.entity';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import * as bcrypt from 'bcrypt';

const roundsOfHashing = +process.env.ROUNDS;

@Injectable()
export class UserService {
  private readonly prisma: PrismaClient;

  constructor(private jwtService: JwtService) {
    this.prisma = new PrismaClient();
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
          type: createUserDto.type,
          name: createUserDto.name,
        },
      });

      // Create a new team for the user using the user's name as the team's name
      const newTeam = await this.prisma.team.create({
        data: {
          name: createUserDto.name,
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

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong email/password combination');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.pk }),
    };
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { pk: id } });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
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
