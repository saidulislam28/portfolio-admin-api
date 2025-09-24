// src/coupons/dto/create-coupon.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsBoolean, IsString, IsArray, Min, Max } from 'class-validator';
import { DiscountType, ServiceType } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';


export class CreateCouponDto {
  @ApiProperty({ description: 'Coupon code (must be unique)', example: 'SUMMER25' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Coupon description', required: false, example: '25% off summer sale' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DiscountType, description: 'Type of discount', example: DiscountType.PERCENTAGE })
  @IsEnum(DiscountType)
  discount_type: DiscountType;

  @ApiProperty({ description: 'Discount value', example: 25 })
  @IsNumber()
  @Min(0)
  discount_value: number;

  @ApiProperty({ description: 'Minimum order amount to apply coupon', required: false, example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_order_amount?: number;

  @ApiProperty({ description: 'Maximum discount amount (for percentage coupons)', required: false, example: 200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max_discount?: number;

  @ApiProperty({ description: 'Maximum number of uses', required: false, example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  max_uses?: number;

  @ApiProperty({ description: 'Start date when coupon becomes valid', required: false, example: '2025-09-01T00:00:00Z' })
  @IsOptional()
  start_date?: Date;

  @ApiProperty({ description: 'Expiration date', required: false, example: '2025-12-31T23:59:59Z' })
  @IsOptional()
  end_date?: Date;

  @ApiProperty({ description: 'Whether coupon is active', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ description: 'Whether coupon is available to all users', default: true, example: false })
  @IsOptional()
  @IsBoolean()
  is_global?: boolean;

  @ApiProperty({
    enum: ServiceType,
    isArray: true,
    description: 'Service categories this coupon applies to',
    required: false,
    example: [ServiceType.book_purchase, ServiceType.speaking_mock_test]
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  categories?: ServiceType[];

  @ApiProperty({
    type: [Number],
    description: 'User IDs who can use this coupon (if not global)',
    required: false,
    example: [101, 102, 103]
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  user_ids?: number[];
}



export class UpdateCouponDto extends PartialType(CreateCouponDto) { }


export class ApplyCouponDto {
  @ApiProperty({ description: 'Coupon code to apply', example: 'SUMMER25' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Order amount before discount', example: 1200 })
  @IsNumber()
  order_amount: number;

  @ApiProperty({ enum: ServiceType, description: 'Service type of the order', example: ServiceType.speaking_mock_test })
  @IsEnum(ServiceType)
  service_type: ServiceType;

  @ApiProperty({ description: 'User ID applying the coupon', example: 101 })
  @IsNumber()
  user_id: number;
}


export class CouponResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'SUMMER25' })
  code: string;

  @ApiProperty({ required: false, example: '25% off summer sale' })
  description?: string;

  @ApiProperty({ enum: DiscountType, example: DiscountType.PERCENTAGE })
  discount_type: DiscountType;

  @ApiProperty({ example: 25 })
  discount_value: number;

  @ApiProperty({ required: false, example: 500 })
  min_order_amount?: number;

  @ApiProperty({ required: false, example: 200 })
  max_discount?: number;

  @ApiProperty({ required: false, example: 100 })
  max_uses?: number;
  
  @ApiProperty({ required: false, example: 100 })
  max_uses_per_user?: number;

  @ApiProperty({ required: false, example: 10 })
  used_count: number;

  @ApiProperty({ required: false, example: '2025-09-01T00:00:00Z' })
  start_date?: Date;

  @ApiProperty({ required: false, example: '2025-12-31T23:59:59Z' })
  end_date?: Date;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: false })
  is_global: boolean;

  @ApiProperty({ type: [String], enum: ServiceType, example: [ServiceType.conversation] })
  categories: ServiceType[];

  @ApiProperty({ example: '2025-08-01T10:00:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-08-15T15:00:00Z' })
  updated_at: Date;
}

// src/coupons/dto/apply-coupon-response.dto.ts

export class ApplyCouponResponseDto {
  @ApiProperty({ example: true })
  valid: boolean;

  @ApiProperty({ required: false, example: 300 })
  discount_amount?: number;

  @ApiProperty({ required: false, example: 900 })
  final_amount?: number;

  @ApiProperty({ required: false, example: 'Coupon applied successfully' })
  message?: string;

  @ApiProperty({ required: false, type: () => CouponResponseDto })
  coupon?: CouponResponseDto;
}


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
