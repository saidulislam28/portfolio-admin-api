import { BadRequestException, Body, Controller, Delete, Post } from '@nestjs/common';
import { res } from 'src/common/response.helper';
import { DeviceTokenService } from './device-token.service';

@Controller('user/device-tokens')
export class DeviceTokenController {
    constructor(private readonly deviceTokenService: DeviceTokenService) { }

    @Post()
    async registerToken(
        @Body() body: { token: string; recipient_type: string; user_id: number },
    ) {
        const { token, recipient_type, user_id } = body;

        if (!token || !user_id || !recipient_type) {
            throw new BadRequestException('Missing token, user_id, or recipient_type');
        }

        const result = await this.deviceTokenService.registerToken(user_id, token, recipient_type);
        return res.success(result);
    }

}
