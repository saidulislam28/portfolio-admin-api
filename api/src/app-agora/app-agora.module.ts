import { Module } from '@nestjs/common';
import { AgoraTokenService } from './agora-token.service';
import { AgoraTokenController } from './agora-token.controller';

@Module({
  controllers: [AgoraTokenController],
  providers: [AgoraTokenService],
  exports: [AgoraTokenService],
})
export class AppAgoraModule {}