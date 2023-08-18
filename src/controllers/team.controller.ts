import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TeamService } from '../services/team.service';

class CreateTeamDto {
  name: string;
  description: string;
  userId: number;
}

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

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
}
