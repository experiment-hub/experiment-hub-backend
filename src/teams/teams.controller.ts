import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { TeamMediaService } from './teamMedia.service';
import { TeamService } from './teams.service';

class CreateTeamDto {
  name: string;
  description: string;
  userId: number;
}

class UpdateTeamDto {
  name?: string;
  description?: string;
}

@Controller('teams')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMediaService: TeamMediaService,
  ) {}

  @Post()
  async createTeam(@Body() createTeamDto: CreateTeamDto) {
    try {
      const newTeam = await this.teamService.createTeam(createTeamDto);
      return newTeam;
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the team.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateTeam(
    @Param('id') id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    try {
      const updatedTeam = await this.teamService.updateTeam(id, updateTeamDto);
      return updatedTeam;
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the team.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getTeam(@Param('id') id: number) {
    try {
      const team = await this.teamService.getTeamById(id);
      return team;
    } catch (error) {
      throw new HttpException(
        'An error occurred while finding the team.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async listTeams(@Query('userId') userId?: number) {
    try {
      const teams = await this.teamService.listTeams(userId);
      return teams;
    } catch (error) {
      throw new HttpException(
        'An error occurred while finding teams.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/media')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileUrl = await this.teamMediaService.uploadFileToSpaces(file);

      return { message: 'File uploaded successfully', fileUrl };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
