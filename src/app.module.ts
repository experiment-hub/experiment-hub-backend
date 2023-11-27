import { Module } from '@nestjs/common';

import { AnswerModule } from './answers/answers.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ExperimentsModule } from './experiments/experiments.module';
import { TeamModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    TeamModule,
    AnswerModule,
    ExperimentsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
