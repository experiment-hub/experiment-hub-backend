import { Module } from '@nestjs/common';

import { AnswerModule } from './answers/answers.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ExperimentsModule } from './experiments/experiments.module';
import { FormModule } from './forms/forms.module';
import { TeamModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    FormModule,
    DatabaseModule,
    TeamModule,
    AnswerModule,
    ExperimentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
