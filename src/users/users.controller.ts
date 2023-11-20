import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeamsService } from 'src/teams/teams.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly teamsService: TeamsService,
  ) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.usersService.findById(id);
    } catch (error) {
      throw new HttpException(
        `An error occurred while finding the user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/teams')
  async getUserTeams(@Param('id', ParseIntPipe) id: number) {
    try {
      const teams = await this.usersService.findUserTeams(id);
      return teams;
    } catch (error) {
      throw new HttpException(
        `An error occurred while finding the user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/experiments')
  async getUserExperiments(@Param('id', ParseIntPipe) id: number) {
    try {
      const teams = await this.usersService.findUserTeams(id);

      const experiments = await Promise.all(
        teams.map((team) => this.teamsService.getTeamExperiments(team.pk)),
      ).then((experiments) => experiments.flat());

      return experiments;
    } catch (error) {
      throw new HttpException(
        `An error occurred while finding the user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return this.usersService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        `An error occurred while updating the user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
