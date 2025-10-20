/* eslint-disable  */
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtSignService } from 'src/user-auth/jwt.sign.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 3,
    }]),

  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtSignService, JwtService],
  exports: [JwtSignService], // ✅ Export it so other modules can use it
})
export class AuthModule { }