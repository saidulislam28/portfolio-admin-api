import { Injectable } from '@nestjs/common';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

@Injectable()
export class AgoraTokenService {
  private readonly appId = process.env.AGORA_APP_ID;
  private readonly appCertificate = process.env.AGORA_APP_CERTIFICATE;

  /**
   * Generates a single RTC token for a specific user and channel.
   * @param channelName The name of the channel.
   * @param userId The unique identifier for the user (numeric).
   * @param role The role of the user, either 'publisher' or 'subscriber'.
   * @returns The generated RTC token.
   */
  generateRtcToken(channelName: string, userId: number, role: 'publisher' | 'subscriber' = 'publisher'): string {
    if (!this.appId || !this.appCertificate) {
      throw new Error('Agora App ID and App Certificate must be configured');
    }

    // Token expiration time (24 hours from now)
    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + (24 * 3600);
    
    const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      userId,
      agoraRole,
      expirationTimeInSeconds
    );

    console.log('built token', token, channelName, userId)

    return token;
  }

  /**
   * NEW METHOD
   * Generates three publisher tokens for a given channel name with hardcoded user IDs (1, 2, 3).
   * @param channelName The name of the channel for which to generate tokens.
   * @returns An object containing the three generated tokens, keyed by user ID.
   */
  generateHardcodedTokensForChannel(channelName: string): { userId1: string; userId2: string; userId3: string } {
    if (!this.appId || !this.appCertificate) {
      throw new Error('Agora App ID and App Certificate must be configured');
    }

    // Common settings for all tokens
    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + (24 * 3600); // 24 hours
    const role = RtcRole.PUBLISHER;
    const hardcodedUserIds = [1, 2, 3];
    
    // Generate a token for each hardcoded user ID
    const tokens = hardcodedUserIds.map(userId => {
        return RtcTokenBuilder.buildTokenWithUid(
            this.appId,
            this.appCertificate,
            channelName,
            userId,
            role,
            expirationTimeInSeconds
        );
    });

    return {
        userId1: tokens[0],
        userId2: tokens[1],
        userId3: tokens[2],
    };
  }


  /**
   * Generates a wildcard token that can be used to join any channel.
   * @param userId The user ID for the token (0 allows any user).
   * @param role The role of the user.
   * @returns The generated wildcard RTC token.
   */
  generateWildcardToken(userId: number = 0, role: 'publisher' | 'subscriber' = 'publisher'): string {
    if (!this.appId || !this.appCertificate) {
      throw new Error('Agora App ID and App Certificate must be configured');
    }

    // Token expiration time (longer for wildcard tokens - 7 days)
    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + (7 * 24 * 3600);
    
    const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Use empty string as channel name for wildcard token
    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      '', // Empty channel name creates a wildcard token
      userId,
      agoraRole,
      expirationTimeInSeconds
    );

    return token;
  }

  /**
   * Generates a single RTC token using a string account instead of a numeric UID.
   * @param channelName The name of the channel.
   * @param account The unique string identifier for the user.
   * @param role The role of the user.
   * @returns The generated RTC token.
   */
  generateRtcTokenWithAccount(channelName: string, account: string, role: 'publisher' | 'subscriber' = 'publisher'): string {
    if (!this.appId || !this.appCertificate) {
      throw new Error('Agora App ID and App Certificate must be configured');
    }

    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + (24 * 3600);
    const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const token = RtcTokenBuilder.buildTokenWithAccount(
      this.appId,
      this.appCertificate,
      channelName,
      account,
      agoraRole,
      expirationTimeInSeconds
    );

    return token;
  }
}
