import { AuthService } from '@app/auth';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly authService: AuthService) {}

  getHello(): string {
    return 'Hello World!' + this.authService.getHello();
  }
}
