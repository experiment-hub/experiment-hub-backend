import { Module } from '@nestjs/common';

import { AnswerModule } from './answers/answers.module';
import { DatabaseModule } from './database/database.module';
import { FormModule } from './forms/forms.module';
import { TeamModule } from './teams/teams.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [FormModule, UserModule, DatabaseModule, TeamModule, AnswerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
