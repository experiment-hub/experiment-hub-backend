import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthEntity> {
    const { password: userPassword, ...user } = await this.usersService.findOne(
      email,
    );

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, userPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong email/password combination');
    }

    return {
      accessToken: this.jwtService.sign({ user }),
    };
  }
}
