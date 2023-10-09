import { Module } from '@nestjs/common';
import { TeamController } from 'src/controllers/team.controller';
import { TeamService } from 'src/services/team.service';
import { TeamMediaService } from 'src/services/teamMedia.service';
@Module({
  controllers: [TeamController],
  providers: [TeamService, TeamMediaService],
  exports: [TeamService, TeamMediaService],
})
export class TeamModule {}
