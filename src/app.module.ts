import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/user.controller';

import { AppService } from './services/app.service';
import { UserService } from './services/user.service';

import { AuthModule } from '@app/auth';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
