import { Module } from '@nestjs/common';

import { TeamMediaService } from './teamMedia.service';
import { TeamController } from './teams.controller';
import { TeamService } from './teams.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService, TeamMediaService],
  exports: [TeamService, TeamMediaService],
})
export class TeamModule {}
