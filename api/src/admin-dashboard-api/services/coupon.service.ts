// src/coupons/coupons.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DiscountType, ServiceType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplyCouponDto, ApplyCouponResponseDto, CouponResponseDto, CreateCouponDto, UpdateCouponDto } from '../dtos/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) { }

  async create(createCouponDto: CreateCouponDto): Promise<CouponResponseDto> {
    const { categories, user_ids, ...couponData } = createCouponDto;

    // Check if code already exists
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { code: couponData.code },
    });

    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        ...couponData,
        coupon_categories: categories ? {
          create: categories.map(category => ({ category })),
        } : undefined,
        coupon_users: user_ids ? {
          create: user_ids.map(userId => ({ user_id: userId })),
        } : undefined,
      },
      include: {
        coupon_categories: true,
        coupon_users: true,
      },
    });

    return this.mapToResponseDto(coupon);
  }

  async findAll(): Promise<CouponResponseDto[]> {
    const coupons = await this.prisma.coupon.findMany({
      include: {
        coupon_categories: true,
        coupon_users: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return coupons.map(coupon => this.mapToResponseDto(coupon));
  }

  async findOne(id: number): Promise<CouponResponseDto> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        coupon_categories: true,
        coupon_users: true,
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return this.mapToResponseDto(coupon);
  }

  async update(id: number, updateCouponDto: UpdateCouponDto): Promise<CouponResponseDto> {
    const { categories, user_ids, ...couponData } = updateCouponDto;

    const coupon = await this.prisma.coupon.update({
      where: { id },
      data: {
        ...couponData,
        coupon_categories: categories ? {
          deleteMany: {},
          create: categories.map(category => ({ category })),
        } : undefined,
        coupon_users: user_ids ? {
          deleteMany: {},
          create: user_ids.map(userId => ({ user_id: userId })),
        } : undefined,
      },
      include: {
        coupon_categories: true,
        coupon_users: true,
      },
    });

    return this.mapToResponseDto(coupon);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.coupon.delete({
      where: { id },
    });
  }

  async applyCoupon(applyCouponDto: ApplyCouponDto): Promise<ApplyCouponResponseDto> {
    const { code, order_amount, service_type, user_id } = applyCouponDto;

    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
      include: {
        coupon_categories: true,
        coupon_users: true,
      },
    });

    if (!coupon) {
      return {
        valid: false,
        message: 'Invalid coupon code',
      };
    }

    // Validate coupon
    const validation = await this.validateCoupon(coupon, order_amount, service_type, user_id);

    if (!validation.valid) {
      return validation;
    }

    // Calculate discount
    let discountAmount = 0;

    if (coupon.discount_type === DiscountType.FIXED) {
      discountAmount = Math.min(coupon.discount_value, order_amount);
    } else {
      discountAmount = (order_amount * coupon.discount_value) / 100;

      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    }

    const finalAmount = order_amount - discountAmount;

    return {
      valid: true,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      coupon: this.mapToResponseDto(coupon),
    };
  }

  private async validateCoupon(
    coupon: any,
    orderAmount: number,
    serviceType: ServiceType,
    userId: number
  ): Promise<ApplyCouponResponseDto> {
    const now = new Date();

    // Check if coupon is active
    if (!coupon.is_active) {
      return { valid: false, message: 'Coupon is not active' };
    }

    // Check date validity
    if (coupon.start_date && now < coupon.start_date) {
      return { valid: false, message: 'Coupon is not yet valid' };
    }

    if (coupon.end_date && now > coupon.end_date) {
      return { valid: false, message: 'Coupon has expired' };
    }

    // Check usage limits
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }

    // Check minimum order amount
    if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
      return {
        valid: false,
        message: `Minimum order amount of ${coupon.min_order_amount} required`
      };
    }

    // Check service category restrictions
    if (coupon.coupon_categories.length > 0) {
      const validCategory = coupon.coupon_categories.some(
        (cat: any) => cat.category === serviceType
      );

      if (!validCategory) {
        return { valid: false, message: 'Coupon not valid for this service type' };
      }
    }

    // Check user restrictions
    if (!coupon.is_global && coupon.coupon_users.length > 0) {
      const validUser = coupon.coupon_users.some(
        (cu: any) => cu.user_id === userId
      );

      if (!validUser) {
        return { valid: false, message: 'Coupon not valid for this user' };
      }
    }

    return { valid: true };
  }

  async recordCouponUsage(couponId: number, orderId: number, discountAmount: number): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.coupon.update({
        where: { id: couponId },
        data: { used_count: { increment: 1 } },
      }),
      this.prisma.orderCoupon.create({
        data: {
          coupon_id: couponId,
          order_id: orderId,
          discount_amount: discountAmount,
        },
      }),
    ]);
  }

  private mapToResponseDto(coupon: any): CouponResponseDto {
    return {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount,
      max_uses_per_user: coupon.max_uses_per_user,
      max_discount: coupon.max_discount,
      max_uses: coupon.max_uses,
      used_count: coupon.used_count,
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      is_active: coupon.is_active,
      is_global: coupon.is_global,
      categories: coupon.coupon_categories.map((cc: any) => cc.category),
      created_at: coupon.created_at,
      updated_at: coupon.updated_at,
    };
  }
}