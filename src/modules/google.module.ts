import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { GoogleController } from '../controllers/google.controller';
import { GoogleService } from '../services/google.service';
import { GoogleStrategy } from '../strategies/google.strategy';
import { UserService } from 'src/services/user.service';

const jwtSecret = process.env.JWT_SECRET;

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '5m' }, // e.g. 30s, 7d, 24h
    }),
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, UserService],
})
export class GoogleModule {}
