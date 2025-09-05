import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateAdminUser(username, password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
