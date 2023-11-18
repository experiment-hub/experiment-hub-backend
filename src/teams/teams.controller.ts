import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
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

  @Get()
  async getTeams() {
    try {
      const teams = await this.teamService.listTeams();
      return teams;
    } catch (error) {
      throw new HttpException(
        'An error occurred while finding teams.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getTeam(@Param('id', ParseIntPipe) id: number) {
    try {
      const team = await this.teamService.getTeamById(id);
      // TODO: devolver miembros y experimentos
      return team;
    } catch (error) {
      throw new HttpException(
        'An error occurred while finding the team.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/members')
  async getTeamMembers(@Param('id', ParseIntPipe) id: number) {
    // TODO: devolver miembros
  }

  @Get(':id/expeiments')
  async getTeamExperiments(@Param('id', ParseIntPipe) id: number) {
    // TODO: devolver miembros
  }

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
    @Param('id', ParseIntPipe) id: number,
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

  // @Get()
  // async listTeams(@Query('userId') userId?: number) {
  //   try {
  //     const teams = await this.teamService.listTeams(userId);
  //     return teams;
  //   } catch (error) {
  //     throw new HttpException(
  //       'An error occurred while finding teams.',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  @Post(':id/media')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Param('id', ParseIntPipe) id: number,
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
