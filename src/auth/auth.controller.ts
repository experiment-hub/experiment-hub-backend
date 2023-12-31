import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    try {
      return this.authService.validateUser(email, password);
    } catch (error) {
      throw new HttpException(
        `An error occurred on login: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('signup')
  @ApiCreatedResponse({ type: AuthEntity })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const { password } = createUserDto;
      const {
        user: { email },
      } = await this.usersService.createUser(createUserDto);
      return this.authService.validateUser(email, password);
    } catch (error) {
      throw new HttpException(
        `An error occurred while creating the user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Post('logout')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: AuthEntity })
  // async logout(@Body() body: any) {
  //   try {
  //     // return this.usersService.logout(refreshToken);
  //     // TODO: logout user
  //   } catch (error) {
  //     throw new HttpException(
  //       `An error occurred while logging out: ${error.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
