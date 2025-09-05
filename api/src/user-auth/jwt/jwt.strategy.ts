import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// https://docs.nestjs.com/security/authentication#implementing-passport-jwt
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt_secret'),
    });
  }

  async validate(payload: any) {
    // this obj will be available on req.user
    return {
      id: payload.id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      role: payload.role
    };
  }
}
