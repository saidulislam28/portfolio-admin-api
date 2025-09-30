import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { Role } from 'src/user-auth/dto/role.enum';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { CouponResponseDto, ValidateCouponDto, ValidateCouponResponseDto } from '../dto/coupon.dto';
import { CouponService } from '../services/coupon.service';

@ApiTags('User: Coupons')
@Controller('user/coupons')
@HasRoles(Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CouponController {
    constructor(
        private readonly couponService: CouponService,
    ) { }

    @Post('validate')
    @ApiOperation({ summary: 'Validate a coupon code' })
    @ApiResponse({
        status: 200,
        description: 'Coupon validation result',
        type: ValidateCouponResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiBody({ type: ValidateCouponDto })
    async validateCoupon(
        @Body() validateCouponDto: ValidateCouponDto,
        @Req() req
    ) {
        const user_id = req.user.id
        const response = await this.couponService.validateCoupon(validateCouponDto, user_id);

        return res.success(response)
    }

    @Get('my-coupons')
    @ApiOperation({ summary: 'Get all coupons created for the authenticated user' })
    @ApiResponse({
        status: 200,
        description: 'List of user coupons',
        type: [CouponResponseDto],
    })
    // @ApiResponse({ status: 401, description: 'Unauthorized' })

    async getUserCoupons(
        @Req() req
    ) {

        console.log("user", req.user)

        const user_id = req.user.id
        const response = await this.couponService.getUserCoupons(user_id);
        return res.success(response)
    }
}