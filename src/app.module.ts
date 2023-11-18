import { Module } from '@nestjs/common';

import { AnswerModule } from './answers/answers.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/users.module';
import { FormModule } from './forms/forms.module';
import { TeamModule } from './teams/teams.module';
import { GoogleModule } from './modules/google.module';
@Module({
  imports: [
    FormModule,
    UserModule,
    DatabaseModule,
    TeamModule,
    AnswerModule,
    GoogleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
