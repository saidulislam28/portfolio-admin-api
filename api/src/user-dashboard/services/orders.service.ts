/* eslint-disable */
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ServiceType, Prisma, DiscountType, Coupon } from '@prisma/client';
import { Queue } from 'bull';
import { DateTime } from 'luxon';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { QUEUE_NAME } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import SSLCommerzPayment from 'sslcommerz-lts';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderDto } from '../dto/order.dto';

interface CouponCalculationResult {
  coupon: Coupon | null;
  discountAmount: number;
  finalTotal: number;
  originalTotal: number;
}

interface SSLCommerzCredentials {
  storeId: string;
  storePass: string;
  isLive: boolean;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)
  private sslCommerzLiveStoreId = process.env.SSLCOMMERZ_STORE_ID;
  private sslCommerzLiveStorePass = process.env.SSLCOMMERZ_STORE_PASS;
  private sslCommerzTestStoreId = process.env.SSLCOMMERZ_TEST_STORE_ID;
  private sslCommerzTestStorePass = process.env.SSLCOMMERZ_TEST_STORE_PASS;
  private sslCommerzIsLive = process.env.SSLCOMMERZ_IS_LIVE == 'true';
  private nodemailerTransport: Mail;
  private mode: string;


  constructor(
    private prisma: PrismaService,
    @InjectQueue(QUEUE_NAME) private speakingQue: Queue,
  ) {
    this.nodemailerTransport = nodemailer.createTransport({
      pool: true,
      service: 'Gmail',
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    this.mode = process.env.NODE_ENV;
  }


  private async getSSLCommerzCredentials(userId: number): Promise<SSLCommerzCredentials> {
    try {
      // Find user to check if they are a test user
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { is_test_user: true, id: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.is_test_user) {
        this.logger.log(`Using SSLCommerz test credentials for user ${userId}`);
        return {
          storeId: this.sslCommerzTestStoreId,
          storePass: this.sslCommerzTestStorePass,
          isLive: false
        };
      } else {
        this.logger.log(`Using SSLCommerz live credentials for user ${userId}`);
        return {
          storeId: this.sslCommerzLiveStoreId,
          storePass: this.sslCommerzLiveStorePass,
          isLive: true
        };
      }
    } catch (error) {
      this.logger.error('Error getting SSLCommerz credentials, falling back to test mode', error);
      // Fallback to test credentials if there's an error
      return {
        storeId: this.sslCommerzTestStoreId,
        storePass: this.sslCommerzTestStorePass,
        isLive: false
      };
    }
  }

  /**
   * Validate and calculate coupon discount
   */
  private async validateAndCalculateCoupon(
    couponCode: string,
    userId: number,
    serviceType: ServiceType,
    originalTotal: number
  ): Promise<CouponCalculationResult> {
    // Find the coupon
    const coupon = await this.prisma.coupon.findFirst({
      where: {
        code: {
          equals: couponCode,
          mode: 'insensitive'
        },
        is_active: true,
      },
      include: {
        coupon_categories: true,
        coupon_users: {
          where: { user_id: userId }
        },
        coupon_orders: true
      }
    });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    // Check if coupon is expired
    const now = DateTime.now();
    if (coupon.start_date && DateTime.fromJSDate(coupon.start_date) > now) {
      throw new BadRequestException('Coupon is not yet active');
    }
    if (coupon.end_date && DateTime.fromJSDate(coupon.end_date) < now) {
      throw new BadRequestException('Coupon has expired');
    }

    // Check if coupon has reached maximum usage
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      throw new BadRequestException('Coupon usage limit exceeded');
    }

    // Check per-user usage limit (if you added the CouponUsage model)
    if (coupon.max_uses_per_user) {
      const userUsageCount = await this.prisma.couponUsage?.count({
        where: {
          coupon_id: coupon.id,
          user_id: userId
        }
      }) || coupon.coupon_users.length; // Fallback to existing structure

      if (userUsageCount >= coupon.max_uses_per_user) {
        throw new BadRequestException('You have reached the usage limit for this coupon');
      }
    }

    // Check if coupon is applicable to the service type
    if (coupon.coupon_categories.length > 0) {
      const applicableCategories = coupon.coupon_categories.map(cc => cc.category);
      if (!applicableCategories.includes(serviceType)) {
        throw new BadRequestException('Coupon is not applicable to this service type');
      }
    }

    // Check minimum order amount
    if (coupon.min_order_amount && originalTotal < coupon.min_order_amount) {
      throw new BadRequestException(
        `Minimum order amount of ${coupon.min_order_amount} required for this coupon`
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === DiscountType.PERCENTAGE) {
      discountAmount = (originalTotal * coupon.discount_value) / 100;
      // Apply max discount limit if set
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else if (coupon.discount_type === DiscountType.FIXED) {
      discountAmount = Math.min(coupon.discount_value, originalTotal); // Don't exceed order total
    }

    const finalTotal = Math.max(0, originalTotal - discountAmount); // Ensure total doesn't go negative

    return {
      coupon,
      discountAmount,
      finalTotal,
      originalTotal
    };
  }

  private async createAppointments(
    prisma: Prisma.TransactionClient,
    orderId: number,
    appointments: any[],
    user_id: number,
    user_timezone: string
  ) {
    const createdAppointments = [];

    // Validate all appointments first
    // for (const appointment of appointments) {
    //   await this.validateAppointment(appointment, orderId, prisma);
    // }

    for (const appointmentData of appointments) {
      const startDateTime = DateTime.fromISO(appointmentData.start_at);
      const endDateTime = DateTime.fromISO(appointmentData.end_at);

      // Convert to UTC for storage
      const startUTC = startDateTime.toUTC();
      const endUTC = endDateTime.toUTC();

      // Extract slot information
      const slotDate = startUTC.startOf('day').toJSDate();
      const slotTime = startUTC.toFormat('HH:mm');

      const appointment = await prisma.appointment.create({
        data: {
          start_at: startUTC.toJSDate(),
          end_at: endUTC.toJSDate(),
          slot_date: slotDate,
          slot_time: slotTime,
          duration_in_min: endDateTime.diff(startDateTime, 'minutes').minutes,
          user_id: user_id,
          order_id: orderId,
          notes: appointmentData.notes,
          user_timezone: user_timezone,
          token: uuidv4(),
        },
        include: {
          User: true,
          Consultant: true,
          Order: true
        }
      });

      createdAppointments.push(appointment);
    }

    return createdAppointments;
  }

  /**
     * Validate appointment before creation
     */
  private async validateAppointment(appointment, orderId, prisma): Promise<void> {

    const client = prisma || this.prisma;
    try {
      const startDateTime = DateTime.fromISO(appointment.start_at);
      const endDateTime = DateTime.fromISO(appointment.end_at);

      // Check if appointment is in the future
      if (startDateTime <= DateTime.now()) {
        throw new BadRequestException('Appointment must be scheduled for a future time');
      }

      // Check if slot is available
      const startUTC = startDateTime.toUTC();
      const slotDate = startUTC.startOf('day');
      const slotTime = startUTC.toFormat('HH:mm');

      const totalConsultants = await this.prisma.consultant.count({ where: { is_active: true } });

      const existingAppointments = await this.prisma.appointment.count({
        where: {
          slot_date: slotDate.toJSDate(),
          slot_time: slotTime,
          status: { not: 'CANCELLED' }
        }
      });

      if (existingAppointments >= totalConsultants) {
        throw new BadRequestException(`Time slot ${slotTime} is fully booked`);
      }

      // Validate order exists
      const existingOrder = await client.order.findUnique({
        where: { id: orderId }
      });

      if (!existingOrder) {
        throw new BadRequestException(`Order with ID ${orderId} not found`);
      }
    } catch (error) {
      console.log("error validate appointment", error);
    }
  }

  private async createOrderItems(prisma: Prisma.TransactionClient, orderId: number, items: any[]) {
    return await prisma.orderItem.createMany({
      data: items.map(item => ({
        ...item,
        order_id: orderId,
        subtotal: item.qty * item.unit_price,
      })),
    });
  }


  private async createSSlPayment(orderData, transactionId: string, baseUrl: string, user_id) {

    const credentials = await this.getSSLCommerzCredentials(user_id);


    const sslcz = new SSLCommerzPayment(
      credentials.storeId,
      credentials.storePass,
      credentials.isLive,
    );


    const paymentData = {
      total_amount: orderData?.total,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${baseUrl}/api/v1/payment/redirect?status=success&tran_id=${transactionId}`,
      fail_url: `${baseUrl}/api/v1/payment/redirect?status=failed`,
      cancel_url: `${baseUrl}/api/v1/payment/redirect?status=canceled`,
      ipn_url: `${baseUrl}/api/v1/payment/redirect?status=success&tran_id=${transactionId}`,
      product_name: orderData?.Package?.name ?? "Product",
      product_category: 'Appointment',
      product_profile: 'general',
      cus_name: `${orderData.first_name}`,
      cus_email: orderData.email,
      cus_phone: orderData.phone,
      shipping_method: 'NO',
      value_a: orderData?.id
    };



    try {
      const sslResponse = await sslcz.init(paymentData);

      this.logger.log(`SSLCommerz payment initialized for user ${user_id}. Test mode: ${!credentials.isLive}`);

      return {
        payment_url: sslResponse.GatewayPageURL,
        order_id: orderData.id,
        transaction_id: transactionId,
        is_test_payment: !credentials.isLive
      };
    } catch (error) {
      throw new HttpException(
        'Payment Initialization Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createPaymentRecord(orderData: any, user_id: number, baseUrl: string, transactionId: string) {
    const createSslPay = await this.createSSlPayment(orderData, transactionId, baseUrl, user_id);

    if (!createSslPay) {
      throw new HttpException(
        'Payment Create failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const createPayment = await this.prisma.payment.create({
      data: {
        order_id: orderData.id,
        user_id: user_id,
        amount: orderData.total,
        currency: 'BDT',
        payment_method: 'sslcommerz',
        transaction_id: transactionId,
        is_test_payment: createSslPay.is_test_payment,
      },
    });


    if (!createPayment) {
      throw new HttpException(
        'Payment Data create failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      transaction_id: createSslPay.transaction_id,
      payment_url: createSslPay.payment_url,
      order_id: createSslPay.order_id,
      payment_id: createPayment.id,
      is_test_payment: createSslPay.is_test_payment
    }

  }

  async createOrder(payload: CreateOrderDto, userId: number, baseUrl: string) {

    try {
      const { appointments, items, user_timezone, coupon_code, ...orderData } = payload;
      const transactionId = uuidv4();

      // Calculate original total
      let originalTotal = orderData.subtotal || 0;

      if (payload?.package_id
        && (orderData?.service_type === ServiceType.exam_registration
          || orderData?.service_type === ServiceType.ielts_academic)) {
        const findPackage = await this.prisma.package.findFirst({ where: { id: payload?.package_id } })
        originalTotal = findPackage?.price_bdt || 0;
        orderData.subtotal = findPackage?.price_bdt;
        orderData.total = findPackage?.price_bdt;
      }

      let couponResult: CouponCalculationResult = {
        coupon: null,
        discountAmount: 0,
        finalTotal: originalTotal,
        originalTotal: originalTotal
      };

      // Process coupon if provided
      if (coupon_code && coupon_code.trim()) {
        couponResult = await this.validateAndCalculateCoupon(
          coupon_code.trim(),
          userId,
          orderData.service_type,
          originalTotal
        );
      }


      // Update order data with final total
      orderData.total = couponResult.finalTotal + (orderData.total - orderData.subtotal);


      this.logger.log(`Order creation: Original: ${originalTotal}, Discount: ${couponResult.discountAmount}, Final: ${couponResult.finalTotal}`);

      const { package_id, payment_status, center_id, ...rest } = orderData;

      const dataToInsert: Prisma.OrderCreateInput = {
        ...rest,
        User: {
          connect: { id: userId }
        },
        status: 'Pending',
        payment_status: 'unpaid',
        sslc_transaction_id: transactionId,
      }

      if (package_id && payload.service_type !== ServiceType.book_purchase) {
        dataToInsert.Package = { connect: { id: package_id } };
      }
      if (center_id && (payload.service_type === ServiceType.ielts_academic || payload.service_type === ServiceType.exam_registration)) {
        dataToInsert.ExamCenter = { connect: { id: center_id } };
      }

      // Use transaction to ensure data integrity
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create the order
        const order: any = await prisma.order.create({
          data: dataToInsert,
          include: {
            Package: true
          }
        });

        // Create coupon order record if coupon was used
        if (couponResult.coupon) {
          await prisma.orderCoupon.create({
            data: {
              order_id: order.id,
              coupon_id: couponResult.coupon.id,
              discount_amount: couponResult.discountAmount
            }
          });

          // Update coupon usage count
          await prisma.coupon.update({
            where: { id: couponResult.coupon.id },
            data: { used_count: { increment: 1 } }
          });

          // Create coupon usage record (if you added the CouponUsage model)
          if (prisma.couponUsage) {
            await prisma.couponUsage.create({
              data: {
                coupon_id: couponResult.coupon.id,
                user_id: userId,
                order_id: order.id
              }
            });
          }
        }


        // Create appointments if applicable
        if (
          (order.service_type === ServiceType.speaking_mock_test ||
            order.service_type === ServiceType.conversation) &&
          appointments &&
          appointments.length > 0
        ) {
          await this.createAppointments(prisma, order.id, appointments, +userId, payload.user_timezone);
        }
        // Create order items if applicable
        else if (
          order.service_type === ServiceType.book_purchase &&
          items &&
          items.length > 0
        ) {
          await this.createOrderItems(prisma, order.id, items);
        }

        return order;
      });

      // Create payment record
      const createPayment = await this.createPaymentRecord(result, userId, baseUrl, transactionId);
      return {
        order_id: result.id,
        payment_url: createPayment.payment_url,
        total_amount: result?.total,
        discount_applied: couponResult.discountAmount,
        coupon_used: couponResult.coupon?.code || null,
        original_amount: couponResult.originalTotal,
        is_test_payment: createPayment.is_test_payment
      };
    } catch (error) {
      console.log("error from create order service>>", error);
      console.log("error", error?.message);
    }
  }

  /**
   * Validate coupon code (public method for frontend validation)
   */
  async validateCoupon(couponCode: string, userId: number, serviceType: ServiceType, orderAmount: number) {
    try {
      const result = await this.validateAndCalculateCoupon(couponCode, userId, serviceType, orderAmount);
      return {
        valid: true,
        coupon: {
          code: result.coupon.code,
          description: result.coupon.description,
          discount_type: result.coupon.discount_type,
          discount_value: result.coupon.discount_value
        },
        discount_amount: result.discountAmount,
        final_total: result.finalTotal
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}