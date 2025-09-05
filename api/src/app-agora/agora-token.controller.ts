import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AgoraTokenService } from './agora-token.service';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GenerateTokenDto {
  @IsString()
  @IsNotEmpty()
  channelName: string;
  @IsNotEmpty()
  @IsNumber()
  userId: number;
  role?: 'publisher' | 'subscriber';
}

export class GenerateTokenWithAccountDto {
  channelName: string;
  account: string;
  role?: 'publisher' | 'subscriber';
}

@Controller('agora')
export class AgoraTokenController {
  constructor(private readonly agoraTokenService: AgoraTokenService) { }

  @Post('wildcard-token')
  generateWildcardToken(@Body() body?: { userId?: number; role?: 'publisher' | 'subscriber' }) {
    try {
      const { userId = 0, role = 'publisher' } = body || {};

      const token = this.agoraTokenService.generateWildcardToken(userId, role);

      return {
        token,
        type: 'wildcard',
        userId,
        role,
        expiresAt: new Date(Date.now() + (7 * 24 * 3600 * 1000)), // 7 days from now
        note: 'This token can be used for any channel'
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('token')
  generateToken(@Body() generateTokenDto: GenerateTokenDto) {
    try {
      const { channelName, userId, role = 'publisher' } = generateTokenDto;

      console.log('got user id', userId)
      if (!channelName || userId === undefined) {
        throw new HttpException('Channel name and user ID are required', HttpStatus.BAD_REQUEST);
      }

      const token = this.agoraTokenService.generateRtcToken(channelName, userId, role);
      console.log("Agora Token", token, channelName, userId)
      return {
        token,
        channelName,
        userId,
        role,
        expiresAt: new Date(Date.now() + (24 * 3600 * 1000)) // 24 hours from now
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('token-with-account')
  generateTokenWithAccount(@Body() generateTokenDto: GenerateTokenWithAccountDto) {
    try {
      const { channelName, account, role = 'publisher' } = generateTokenDto;

      if (!channelName || !account) {
        throw new HttpException('Channel name and account are required', HttpStatus.BAD_REQUEST);
      }

      const token = this.agoraTokenService.generateRtcTokenWithAccount(channelName, account, role);

      return {
        token,
        channelName,
        account,
        role,
        expiresAt: new Date(Date.now() + (24 * 3600 * 1000))
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
