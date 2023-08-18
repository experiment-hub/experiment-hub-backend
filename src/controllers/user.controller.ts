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
import { UserService } from '../services/user.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthEntity } from '../auth/entity/auth.entity';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateUserDto, UpdateUserDto } from 'src/auth/dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from 'src/entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.createUser(createUserDto);
      return newUser;
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async getUser(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async listUsers() {
    return this.userService.listUsers();
  }

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.userService.login(email, password);
  }
}
