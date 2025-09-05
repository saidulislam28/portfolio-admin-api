import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { AdminLoginController } from 'src/user-auth/admin.login.controller';
// import { AdminPasswordResetService } from 'src/user-auth/admin.password-reset.service';
import { AuthService } from 'src/user-auth/auth.service';
import { JwtSignService } from 'src/user-auth/jwt.sign.service';
import { JwtStrategy } from 'src/user-auth/jwt/jwt.strategy';
import { LocalAdminStrategy } from 'src/user-auth/local-admin.auth';
// import { LoginController } from 'src/user-auth/login.controller';
// import { LoginService } from 'src/user-auth/login.service';
import { OtpController } from 'src/user-auth/otp.controller';
import { OtpService } from 'src/user-auth/otp.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AdminLoginController } from './admin.login.controller';
import { AdminAuthService } from './admin.password-reset.service';
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
        AdminAuthService,
        OtpService,
        // InfoService,
        // RegisterService,
        JwtStrategy,
        LocalAdminStrategy,
        // VerifyEmailService,
        JwtSignService
    ],
    controllers: [
        // AuthController,
        // VerifyEmailController,
        // RegisterController,
        // LoginController,
        AdminLoginController,
        OtpController
    ],
})
export class AdminAuthModule { }
