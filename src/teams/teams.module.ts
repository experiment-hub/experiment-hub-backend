import { Module } from '@nestjs/common';
import { TeamController } from 'src/teams/teams.controller';
import { TeamService } from 'src/teams/teams.service';
@Module({
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
