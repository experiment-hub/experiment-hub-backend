import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from '../auth/entities/auth.entity';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateUserDto, UpdateUserDto } from 'src/users/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from 'src/users/user.entity';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: mover a /auth
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    try {
      return this.userService.login(email, password);
    } catch (error) {
      throw new HttpException(
        `An error occurred on login: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TODO: mover a /auth
  @Post('signup')
  @ApiCreatedResponse({ type: UserEntity })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.createUser(createUserDto);
      // TODO: login user on signup
      return newUser;
    } catch (error) {
      throw new HttpException(
        `An error occurred while creating the user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TODO: mover a /auth
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AuthEntity })
  async logout(@Body() body: any) {
    try {
      // return this.userService.logout(refreshToken);
      // TODO: logout user
    } catch (error) {
      throw new HttpException(
        `An error occurred while logging out: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async getUser(@Param('id') id: string) {
    try {
      // TODO: traer experimentos y equipos
      return this.userService.getUserById(+id);
    } catch (error) {
      throw new HttpException(
        `An error occurred while finding the user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Put(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: UserEntity })
  // async updateUser(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   try {
  //     return this.userService.updateUser(+id, updateUserDto);
  //   } catch (error) {
  //     throw new HttpException(
  //       `An error occurred while updating the user: ${error.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
