import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminRole, User } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import { Role } from 'src/user-auth/dto/role.enum';
import { JwtSignService } from 'src/user-auth/jwt.sign.service';

import EmailService from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jwtSignService: JwtSignService,
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
  ) { }

  /*
  * if an admin email is found in DB, send password reset code
  * if email not found in DB, do nothing
  * */
  async sendPasswordResetCodeToEmail(email: string): Promise<any> {
    const user = await this.prismaService.adminUser.findFirst({ where: { email } });

    if (user === null) return true;

    const otp_code = `${crypto.randomInt(100000, 999999)}`;

    const reset = await this.prismaService.adminPasswordReset.findFirst({ where: { email } });

    if (reset) {
      await this.prismaService.adminPasswordReset.update({
        where: { id: reset.id },
        data: { reset_code: otp_code }
      });
    } else {
      await this.prismaService.adminPasswordReset.create({
        data: {
          email,
          reset_code: otp_code
        }
      })
    }

    const text = `Welcome to Trace. password reset code is: ${otp_code}`
    this.emailService.sendMailReset({
      from: 'support@espd.com',
      to: email,
      subject: 'Forgot password',
      text,
    });
    return true;

  }

  async resetPassword(email: string, reset_code: string, new_password: string) {
    const reset = await this.prismaService.adminPasswordReset.findFirst({
      where: {
        email,
        reset_code
      }
    });

    if (reset === null) {
      return false;
    }


    if (reset) {
      const hash = bcryptjs.hashSync(new_password.toString(), 10);
      await this.prismaService.adminUser.update({
        where: { email },
        data: { password: hash }
      });
      await this.prismaService.adminPasswordReset.delete({ where: { id: reset.id } });

      return true;
    }

    return false;
  }

  async loginAdminUser(user: User): Promise<any> {
    const access_token = this.jwtSignService.signJwt(user, Role.Admin);
    return {
      ...user,
      access_token
    };
  }

  async createAdminUser(email: string, first_name: string, last_name: string, password: string): Promise<any> {
    // Check if any admin users already exist using count for better performance
    const userCount = await this.prismaService.adminUser.count();
    
    if (userCount > 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    
    const hash = await bcryptjs.hashSync(password.toString(), 10);
    const user = await this.prismaService.adminUser.create({
      data: {
        email,
        first_name,
        last_name,
        password: hash
      }
    });
    
    return user;
  }


}
