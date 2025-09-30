import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CouponResponseDto, ValidateCouponDto, ValidateCouponResponseDto } from '../dto/coupon.dto';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async validateCoupon(
    validateCouponDto: ValidateCouponDto,
    userId?: number,
  ): Promise<ValidateCouponResponseDto> {
    const { code, orderAmount = 0, serviceType } = validateCouponDto;

    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
      include: {
        coupon_categories: true,
        coupon_users: {
          where: { user_id: userId },
        },
      },
    });

    if (!coupon) {
      return {
        isValid: false,
        message: 'Coupon not found',
      };
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return {
        isValid: false,
        message: 'Coupon is not active',
      };
    }

    // Check date validity
    const now = new Date();
    if (coupon.start_date && now < coupon.start_date) {
      return {
        isValid: false,
        message: 'Coupon is not yet valid',
      };
    }

    if (coupon.end_date && now > coupon.end_date) {
      return {
        isValid: false,
        message: 'Coupon has expired',
      };
    }

    // Check usage limits
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return {
        isValid: false,
        message: 'Coupon usage limit reached',
      };
    }

    // Check if user has already used this coupon
    if (userId && coupon.coupon_users.length > 0) {
      return {
        isValid: false,
        message: 'You have already used this coupon',
      };
    }

    // Check minimum order amount
    if (orderAmount < coupon.min_order_amount) {
      return {
        isValid: false,
        message: `Minimum order amount of ${coupon.min_order_amount} required`,
      };
    }

    // Check category restrictions
    if (!coupon.is_global && serviceType) {
      const validCategory = coupon.coupon_categories.some(
        (cc) => cc.category === serviceType,
      );
      if (!validCategory) {
        return {
          isValid: false,
          message: 'Coupon not valid for this service type',
        };
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discount_type === 'PERCENTAGE') {
      discountAmount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    const couponResponse: CouponResponseDto = {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount,
      max_discount: coupon.max_discount,
      is_active: coupon.is_active,
      is_global: coupon.is_global,
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      categories: coupon.coupon_categories.map((cc) => cc.category),
      max_uses: coupon.max_uses,
      used_count: coupon.used_count,
    };

    return {
      isValid: true,
      message: 'Coupon is valid',
      coupon: couponResponse,
      discountAmount,
    };
  }

  async getUserCoupons(userId: number): Promise<CouponResponseDto[]> {
    const userCoupons = await this.prisma.couponUser.findMany({
      where: { user_id: userId },
      include: {
        coupon: {
          include: {
            coupon_categories: true,
          },
        },
      },
    });

    return userCoupons.map((uc) => ({
      id: uc.coupon.id,
      code: uc.coupon.code,
      description: uc.coupon.description,
      discount_type: uc.coupon.discount_type,
      discount_value: uc.coupon.discount_value,
      min_order_amount: uc.coupon.min_order_amount,
      max_discount: uc.coupon.max_discount,
      is_active: uc.coupon.is_active,
      is_global: uc.coupon.is_global,
      start_date: uc.coupon.start_date,
      end_date: uc.coupon.end_date,
      categories: uc.coupon.coupon_categories.map((cc) => cc.category),
      max_uses: uc.coupon.max_uses,
      used_count: uc.coupon.used_count,
    }));
  }
}