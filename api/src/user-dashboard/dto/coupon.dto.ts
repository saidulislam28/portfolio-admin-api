// src/coupon/dto/validate-coupon.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
// src/coupon/dto/coupon-response.dto.ts
import { DiscountType, ServiceType } from '@prisma/client';

export class ValidateCouponDto {
    @ApiProperty({
        description: 'Coupon code to validate',
        example: 'SUMMER2024',
    })
    @IsString()
    code: string;

    @ApiProperty({
        description: 'Order amount to validate against minimum order amount',
        example: 1000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    orderAmount?: number;

    @ApiProperty({
        description: 'Service type to check category restrictions',
        example: 'ielts_academic',
        required: false,
    })
    @IsString()
    @IsOptional()
    serviceType?: string;
}


export class CouponResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ enum: DiscountType })
    discount_type: DiscountType;

    @ApiProperty()
    discount_value: number;

    @ApiProperty()
    min_order_amount: number;

    @ApiProperty()
    max_discount: number;

    @ApiProperty()
    is_active: boolean;

    @ApiProperty()
    is_global: boolean;

    @ApiProperty()
    start_date: Date;

    @ApiProperty()
    end_date: Date;

    @ApiProperty({ type: [String], enum: ServiceType })
    categories: ServiceType[];

    @ApiProperty()
    max_uses: number;

    @ApiProperty()
    used_count: number;
}

;

export class ValidateCouponResponseDto {
    @ApiProperty()
    isValid: boolean;

    @ApiProperty()
    message: string;

    @ApiProperty({ type: CouponResponseDto, nullable: true })
    coupon?: CouponResponseDto;

    @ApiProperty()
    discountAmount?: number;
}