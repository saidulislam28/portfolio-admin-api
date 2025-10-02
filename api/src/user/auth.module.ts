/* eslint-disable  */
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtSignService } from 'src/user-auth/jwt.sign.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DeviceTokenController } from './device-token.controller';
import { DeviceTokenService } from './device-token.service';
import { UserCacheModule } from 'src/user-cache/user-cache.module';
import { UserDashBoardController } from './app-user-management.controller';
import { UserDashBoardService } from './app-user-management.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 3,
    }]),
    UserCacheModule
  ],
  controllers: [AuthController, DeviceTokenController, UserDashBoardController],
  providers: [AuthService, PrismaService, JwtSignService, JwtService, DeviceTokenService, UserDashBoardService],
  exports: [JwtSignService], // ✅ Export it so other modules can use it
})
export class AuthModule {}