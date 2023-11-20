import { Module } from '@nestjs/common';

import { TeamMediaService } from './teamMedia.service';
import { TeamController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  controllers: [TeamController],
  providers: [TeamsService, TeamMediaService],
  exports: [TeamsService, TeamMediaService],
})
export class TeamModule {}
