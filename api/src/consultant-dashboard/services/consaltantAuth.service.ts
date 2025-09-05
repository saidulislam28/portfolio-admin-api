import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { USER_ROLE } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtSignService } from 'src/user-auth/jwt.sign.service';
import { ForgetPasswordDTO, OtpVerificationDto, registrationDTO } from '../dto/consultant.dto';
import { Role } from 'src/user-auth/dto/role.enum';

@Injectable()
export class ConsultantAuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtSignService: JwtSignService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async registerUser(userData: registrationDTO) {
    const existingUser = await this.prismaService.consultant.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hash = await bcrypt.hash(userData.password.toString(), 10);
    userData.password = hash;

    const consultant = await this.prismaService.consultant.create({
      data: userData,
    });

    delete consultant['password'];
    return consultant;
  }

  async createOtp(data) {
    const otp_code = crypto.randomInt(100000, 999999);
    data.otp = otp_code;

    const is_email_exist = await this.prismaService.otpVerification.deleteMany({
      where: { email: data.email },
    });

    return await this.prismaService.otpVerification.create({
      data,
    });
  }

  async verifyOtp(data: OtpVerificationDto) {

    const check = await this.prismaService.otpVerification.findFirst({
      where: {
        otp: data.otp,
        email: data.email
      }
    });

    if (!check) {
      throw new HttpException('Invalid OTP', HttpStatus.NOT_FOUND);
    }

    const consultant = await this.prismaService.consultant.findFirst({ where: { email: data.email } });

    if (!consultant) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const deleteOpt = await this.prismaService.otpVerification.delete({ where: { id: check.id } });

    const updatedUser = await this.prismaService.consultant.update({ where: { id: consultant.id }, data: { is_verified: true } });

    const access_token = await this.jwtSignService.signJwt(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: USER_ROLE.CONSULTANT
      },
    );

    delete updatedUser['password'];
    delete updatedUser['created_at'];
    delete updatedUser['updated_at'];
    delete updatedUser['login_type'];


    return {
      verified: true,
      user: {
        ...updatedUser,
        token: access_token
      }
    }
  }


  async loginUser(data) {
    // const isEmail = await this.validateEmail(data.email_or_phone);
    // let user = null;
    // if (!isEmail) {
    //   user = await this.prismaService.user.findFirst({
    //     where: { phone: data.email_or_phone },
    //   });
    // } else {
    //   user = await this.prismaService.user.findFirst({
    //     where: { email: data.email_or_phone },
    //   });
    // }

    // console.log("hitting data service", data)

    const consultant = await this.prismaService.consultant.findFirst({
      where: { email: data.email }
    })
    if (consultant === null) {
      throw new HttpException('Invalid Credatials', HttpStatus.UNAUTHORIZED);
    }
    if (!consultant.is_verified) {
      throw new HttpException(
        'This consultant is not verified',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const isPasswordMatch = await bcrypt.compare(data.password, consultant?.password);
    if (!isPasswordMatch) {
      throw new HttpException('Invalid Credatials', HttpStatus.UNAUTHORIZED);
    }

    const access_token = await this.jwtSignService.signJwt({
      id: consultant.id,
      email: consultant.email,
      phone: consultant.phone,
      role: Role.Consultant,
    });
    delete consultant['password'];
    delete consultant['created_at'];
    delete consultant['updated_at'];
    delete consultant['login_type'];
    return {
      ...consultant,
      token: access_token,
    };
  }

  async forgetPassword(data: ForgetPasswordDTO) {
    // const isEmail = await this.validateEmail(data.email_or_phone);
    // let user = null;
    // if (!isEmail) {
    //   user = await this.prismaService.user.findFirst({
    //     where: { phone: data.email_or_phone },
    //   });
    // } else {
    //   user = await this.prismaService.user.findFirst({
    //     where: { email: data.email_or_phone },
    //   });
    // }
    // const user = await this.prismaService.user.findUnique({
    //   where: {
    //     email: 'bitpixel.sihabuddin@gmail.com'
    //   }
    // })

    const consultant = await this.prismaService.consultant.findFirst({
      where: { email: data?.email_or_phone },
    });

    if (!consultant) {
      throw new HttpException('consultant Not found', HttpStatus.UNAUTHORIZED);
    }

    if (!consultant.is_verified) {
      throw new HttpException(
        'This consultant is not verified',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return {
      success: true,
      email: consultant.email
    }
  }

  async updateUser(id: number, data) {

    console.log(id, data)


    const consultant = await this.prismaService.consultant.findFirst({ where: { id } });


    if (!consultant) {
      throw new Error("consultant not found")
    }


    let payload: any = {};

    if (data.profile_image) {
      payload.profile_image = data.profile_image
    }
    if (data.name) {
      payload.full_name = data.name
    }
    if (data.email) {
      payload.email = data.email
    }
    if (data.phone) {
      payload.phone = data.phone
    }

    const req = await this.prismaService.consultant.update({
      where: { id: consultant.id },
      data: payload
    })

    if (req === null) {
      throw new HttpException("User update failed", HttpStatus.NOT_FOUND)
    }
    delete req['password']
    return req



  }



  async resetPassword(data) {
    // const isEmail = await this.validateEmail(data.email_or_phone);
    // let user = null;
    // if (!isEmail) {
    //   user = await this.prismaService.user.findFirst({
    //     where: { phone: data.email_or_phone },
    //   });
    // } else {
    //   user = await this.prismaService.user.findFirst({
    //     where: { email: data.email_or_phone },
    //   });
    // }
    const consultant = await this.prismaService.consultant.findFirst({
      where: { email: data.email_or_phone }
    })
    if (consultant === null) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const findOtp = await this.prismaService.otpVerification.findFirst({ where: { email: data.email_or_phone, otp: data.otp } })
    if (findOtp === null) {
      throw new HttpException('Otp Not Valid', HttpStatus.BAD_REQUEST);
    }

    await this.prismaService.otpVerification.delete({ where: { id: findOtp.id } })

    const hash = await bcrypt.hash(data.password.toString(), 10);

    const updateUser = await this.prismaService.consultant.update({ where: { id: consultant.id }, data: { password: hash } });

    const access_token = await this.jwtSignService.signJwt({
      id: consultant.id,
      email: consultant.email,
      phone: consultant.phone,
      role: USER_ROLE.CONSULTANT,
    });
    delete consultant['password'];
    delete consultant['created_at'];
    delete consultant['updated_at'];
    delete consultant['login_type'];
    return {
      ...consultant,
      token: access_token,
    };
  }


}