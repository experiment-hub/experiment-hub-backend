import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user.module';
import { FormModule } from './modules/form.module';
import { TeamModule } from './modules/team.module';
import { AnswerModule } from './modules/answer.module';
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
