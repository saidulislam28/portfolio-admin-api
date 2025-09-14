import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SocialLoginDto } from '../dto/social-login.dto';
import { SocialAuthService } from '../service/social-auth.service';

@ApiTags('User: Authentication')
@Controller('auth')
export class SocialAuthController {
  constructor(private readonly authService: SocialAuthService) {}

  @Post('social-login')
  @ApiOperation({ summary: 'Social Login', description: 'Login or signup using social provider (Google, Facebook)' })
  @ApiBody({ type: SocialLoginDto })
  @ApiResponse({ status: 200, description: 'Successful login with JWT and user data' })
  async socialLogin(@Body() dto: SocialLoginDto) {
    return this.authService.socialLogin(dto);
  }
}
