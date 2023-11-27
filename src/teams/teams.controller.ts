import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { TeamMediaService } from './teamMedia.service';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('teams')
export class TeamController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly teamMediaService: TeamMediaService,
  ) {}

  @Get()
  async getTeams() {
    try {
      const teams = await this.teamsService.listTeams();
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
      const team = await this.teamsService.getTeamById(id);
      return team;
    } catch (error) {
      throw new HttpException(
        'An error occurred while finding the team.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/slug/:slug')
  async getTeamBySlug(@Param('slug') slug: string) {
    try {
      const team = await this.teamsService.getTeamBySlug(slug);
      return team;
    } catch (error) {
      throw new HttpException(
        'An error occurred while finding the team.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteTeam(@Param('id', ParseIntPipe) id: number) {
    try {
      const team = await this.teamsService.deleteTeam(id);
      return team;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'An error occurred while finding the team.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/members')
  async getTeamMembers(@Param('id', ParseIntPipe) id: number) {
    return await this.teamsService.getTeamMembers(id);
  }

  @Get(':id/experiments')
  async getTeamExperiments(@Param('id', ParseIntPipe) id: number) {
    return await this.teamsService.getTeamExperiments(id);
  }

  @Post()
  async createTeam(@Body() createTeamDto: CreateTeamDto) {
    try {
      const newTeam = await this.teamsService.createTeam(createTeamDto);
      return newTeam;
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the team.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/members')
  async updateTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    try {
      const updatedTeam = await this.teamsService.inviteMembers(
        id,
        updateTeamDto.members,
      );
      return updatedTeam;
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the team.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Post(':id/media')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadMedia(
  //   @Pnaram('id', ParseIntPipe) id: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   try {
  //     const fileUrl = await this.teamMediaService.uploadFileToSpaces(file);
  //     return { message: 'File uploaded successfully', fileUrl };
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
