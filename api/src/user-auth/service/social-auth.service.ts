import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { SocialLoginDto, SocialProvider } from '../dto/social-login.dto';
import { LOGIN_TYPE } from '@prisma/client';
import { JwtSignService } from '../jwt.sign.service';
import { Role } from '../dto/role.enum';

@Injectable()
export class SocialAuthService {
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtSignService: JwtSignService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async socialLogin(dto: SocialLoginDto) {
    let profile: any;

    if (dto.provider === SocialProvider.GOOGLE) {
      profile = await this.verifyGoogle(dto.token);
    } else if (dto.provider === SocialProvider.FACEBOOK) {
      profile = await this.verifyFacebook(dto.token);
    } else {
      throw new UnauthorizedException('Unsupported provider');
    }

    // Find user by provider id
    let user = await this.prisma.user.findFirst({
      where:
        dto.provider === SocialProvider.GOOGLE
          ? { google_id: profile.id }
          : { facebook_id: profile.id },
    });

    // If not found, try by email
    if (!user && profile.email) {
      user = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });
    }

    // If still not found, create a new user
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          full_name: dto?.full_name,
          email: dto?.email,
          profile_image: dto?.profile_image,
          login_type:
            dto.provider === SocialProvider.GOOGLE ? LOGIN_TYPE.GOOGLE : LOGIN_TYPE.FACEBOOK,
          google_id: dto.provider === SocialProvider.GOOGLE ? profile.id : null,
          facebook_id:
            dto.provider === SocialProvider.FACEBOOK ? profile.id : null,
          is_verified: true,
          is_active: true,
        },
      });
    } else {
      // If user exists but provider id is not set, update it
      if (
        dto.provider === SocialProvider.GOOGLE &&
        !user.google_id
      ) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { google_id: profile.id },
        });
      }
      if (
        dto.provider === SocialProvider.FACEBOOK &&
        !user.facebook_id
      ) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { facebook_id: profile.id },
        });
      }
    }

    const access_token = await this.jwtSignService.signJwt({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: Role.User,
    });

    delete user['password'];
    delete user['updated_at'];
    delete user['login_type'];

    return {
      ...user,
      token: access_token,
    };
  }

  private async verifyGoogle(token: string) {
    // TODO hardcoded for test
    // return {
    //     id: 'payload.sub',
    //     email: 'payload.email',
    //     name: 'payload.name',
    //     picture: 'payload.picture',
    //   };

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload?.email_verified) {
        throw new BadRequestException('Google email is not verified');
      }

      if (!payload || !payload.email || !payload.name) {
        throw new BadRequestException('Invalid token payload');
      }
      
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  private async verifyFacebook(token: string) {
    try {
      const fields = 'id,name,email,picture.type(large)';
      const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${token}`;
      const { data } = await axios.get(url);
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture?.data?.url,
      };
    } catch {
      throw new UnauthorizedException('Invalid Facebook token');
    }
  }
}
