import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '../prisma/prisma.module';
// import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtSignService } from './jwt.sign.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalAdminStrategy } from "./local-admin.auth";
// import { AuthController } from './auth.controller';
// import { RegisterController } from './register.controller';
// import { LoginController } from './login.controller';
// import {VerifyEmailController} from './verify-email.controller'
// import {VerifyEmailService} from './verify-email.service';
// import {RegisterService} from './register.service';
// import {InfoService} from './info.service';
// import { LoginService } from './login.service';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
// import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        // privateKey: configService.get<string>('keys.privateKey'),
        // publicKey: configService.get<string>('keys.publicKey'),
        signOptions: { /* expiresIn: '86400s', */algorithm: 'HS256' },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    JwtModule,
    // UsersModule
  ],
  providers: [
    AuthService,
    // LoginService,
    OtpService,
    // InfoService,
    // RegisterService,
    JwtStrategy,
    LocalAdminStrategy,
    // VerifyEmailService,
    JwtSignService
  ],
  controllers: [
    //  AuthController,
    // VerifyEmailController,
    // RegisterController,
    // LoginController,
    OtpController
  ],
})
export class UserAuthModule { }
