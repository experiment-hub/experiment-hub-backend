import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserType } from '../enums/user.enum';

@Injectable()
export class GoogleService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    const user = await this.userService.getUserByEmail(req.user.email);
    if (!user) {
      this.userService.createUser({
        email: req.user.email,
        password: req.user.picture,
        type: UserType.REGULAR,
        name: req.user.firstName + req.user.lastName,
      });
    }

    return {
      accessToken: this.jwtService.sign({ email: req.user.email }),
    };
  }
}
