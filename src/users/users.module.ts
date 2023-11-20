import { Module } from '@nestjs/common';
import { TeamsService } from 'src/teams/teams.service';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TeamsService],
  exports: [UsersService],
})
export class UsersModule {}
