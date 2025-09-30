/* eslint-disable */
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ServiceType, Prisma, DiscountType, Coupon } from '@prisma/client';
import { Queue } from 'bull';
import * as fs from 'fs';
import { compile } from 'handlebars';
import * as pdf from 'html-pdf';
import { DateTime } from 'luxon';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
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

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)
  private sslCommerzStoreId = process.env.SSLCOMMERZ_STORE_ID;
  private sslCommerzStorePass = process.env.SSLCOMMERZ_STORE_PASS;
  private sslCommerzMode = process.env.NODE_ENV !== 'development';
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
          mode: 'insensitive' // Case insensitive search
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
    for (const appointment of appointments) {
      await this.validateAppointment(appointment, orderId, prisma);
    }

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


  private async createSSlPayment(orderData, transactionId: string, baseUrl: string) {

    // console.log("create ssl payment order Data>>", orderData)

    const sslcz = new SSLCommerzPayment(
      this.sslCommerzStoreId,
      this.sslCommerzStorePass,
      this.sslCommerzMode,
    );


    const paymentData = {
      total_amount: orderData?.total,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${baseUrl}/api/v1/payment/redirect?status=success&tran_id=${transactionId}`,
      fail_url: `${baseUrl}/api/v1/payment/redirect?status=failed`,
      cancel_url: `${baseUrl}/api/v1/payment/redirect?status=canceled`,
      ipn_url: `${baseUrl}/api/v1/payment/redirect?status=success&tran_id=${transactionId}`,
      product_name: 'Order',
      product_category: 'Order',
      product_profile: 'general',
      cus_name: `${orderData.first_name} ${orderData.last_name}`,
      cus_email: orderData.email,
      cus_phone: orderData.phone,
      shipping_method: 'NO',
      value_a: orderData?.id
    };


    // console.log('sslc init payload', paymentData)

    try {
      const sslResponse = await sslcz.init(paymentData);

      return {
        payment_url: sslResponse.GatewayPageURL,
        order_id: orderData.id,
        transaction_id: transactionId,
      };
    } catch (error) {
      throw new HttpException(
        'Payment Initialization Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createPaymentRecord(orderData: any, user_id: number, baseUrl: string, transactionId: string) {
    const createSslPay = await this.createSSlPayment(orderData, transactionId, baseUrl);

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
        amount: orderData.total, // Use final total after discount
        currency: 'BDT',
        payment_method: 'sslcommerz',
        transaction_id: transactionId,
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
          data: dataToInsert
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
        original_amount: couponResult.originalTotal
      };
    } catch (error) {
      console.log("error from create order service>>", error);
      console.log("error", error?.message);
    }
  }


  async verifyPayment(payload: any, status: string) {
    const { tran_id } = payload;

    // console.log("hit verify payment", payload, status)

    try {
      const payment = await this.prisma.payment.findFirst({
        where: { transaction_id: tran_id },
        include: {
          Order: {
            include: {
              User: true,
              OrderItem: true,
              Appointment: { include: { Consultant: true } }
            }
          }
        }
      });

      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      // Update payment and order status
      if (status === 'success') {
        await this.prisma.$transaction([
          this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: "PAID" }
          }),
          this.prisma.order.update({
            where: { id: payment.order_id },
            data: {
              payment_status: 'paid',
              status: 'Approved'
            }
          })
        ]);

        this.logger.log(`Payment successful for order ${payment.order_id}`);

        // Generate and send invoice immediately
        try {
          await this.sendInvoiceEmail(
            payment.Order.User.email,
            payment.Order,
            payment
          );
          this.logger.log(`Invoice sent to ${payment.Order.User.email}`);
        } catch (emailError) {
          this.logger.error(`Failed to send invoice email: ${emailError.message}`);
          // You might want to queue a retry here or log to a monitoring system
        }

        return { success: true, message: 'Payment verified successfully' };
      } else {
        // Handle failed payment - rollback coupon usage
        await this.prisma.$transaction(async (prisma) => {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" }
          });

          await prisma.order.update({
            where: { id: payment.order_id },
            data: {
              payment_status: 'unpaid',
              status: 'Canceled'
            }
          });

          // Rollback coupon usage
          // if (payment.Order.OrderCoupon.length > 0) {
          //   for (const orderCoupon of payment.Order.OrderCoupon) {
          //     await prisma.coupon.update({
          //       where: { id: orderCoupon.coupon_id },
          //       data: { used_count: { decrement: 1 } }
          //     });

          //     // Remove coupon usage record if using the new model
          //     if (prisma.couponUsage) {
          //       await prisma.couponUsage.deleteMany({
          //         where: {
          //           coupon_id: orderCoupon.coupon_id,
          //           order_id: payment.order_id
          //         }
          //       });
          //     }
          //   }
          // }
        });

        return { success: false, message: 'Payment failed' };
      }
    } catch (error) {
      this.logger.error(`Payment verification failed: ${error.message}`);
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateInvoicePdf(order: any, payment: any): Promise<Buffer> {

    console.log("hit generate invoice pdf function", order, payment)

    try {
      // Ensure templates directory exists
      const templatesDir = path.join(__dirname, '../../templates');
      if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
      }

      const templatePath = path.join(templatesDir, 'invoice.hbs');

      // Create default template if it doesn't exist
      if (!fs.existsSync(templatePath)) {
        const defaultTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice {{invoiceNumber}}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
    h1 { color: #2c3e50; margin-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    .total { font-weight: bold; }
    .discount { color: #27ae60; }
    .footer { margin-top: 30px; text-align: center; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>INVOICE #{{invoiceNumber}}</h1>
        <p>Date: {{date}}</p>
      </div>
      <div>
        <p><strong>{{company.name}}</strong></p>
        <p>{{company.address}}</p>
        <p>{{company.email}}</p>
      </div>
    </div>

    <div>
      <h3>Bill To:</h3>
      <p>{{customer.name}}</p>
      <p>{{customer.email}}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {{#each items}}
        <tr>
          <td>{{name}}</td>
          <td>{{quantity}}</td>
          <td>৳{{price}}</td>
          <td>৳{{total}}</td>
        </tr>
        {{/each}}
        <tr>
          <td colspan="3"><strong>Subtotal</strong></td>
          <td><strong>৳{{subtotal}}</strong></td>
        </tr>
        {{#if coupon}}
        <tr class="discount">
          <td colspan="3">Discount ({{coupon.code}})</td>
          <td>-৳{{coupon.discount}}</td>
        </tr>
        {{/if}}
        <tr class="total">
          <td colspan="3"><strong>Total</strong></td>
          <td><strong>৳{{total}}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <p>Thank you for your business!</p>
    </div>
  </div>
</body>
</html>
        `;
        fs.writeFileSync(templatePath, defaultTemplate);
      }

      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const template = compile(templateContent);

      // Prepare invoice data with coupon information
      const orderCoupon = order.OrderCoupon?.[0];
      const invoiceData = {
        invoiceNumber: `INV-${order.id}-${payment.id}`,
        date: new Date().toLocaleDateString(),
        customer: {
          name: `${order.first_name} ${order.last_name}`.trim(),
          email: order.email,
          phone: order.phone || 'N/A'
        },
        items: order.OrderItem?.map(item => ({
          name: item.name || 'Service',
          quantity: item.qty || 1,
          price: item.unit_price?.toFixed(2) || '0.00',
          total: ((item.qty || 1) * (item.unit_price || 0)).toFixed(2)
        })) || [{
          name: order.service_type || 'Service',
          quantity: 1,
          price: (order.total + (orderCoupon?.discount_amount || 0)).toFixed(2),
          total: (order.total + (orderCoupon?.discount_amount || 0)).toFixed(2)
        }],
        subtotal: (order.total + (orderCoupon?.discount_amount || 0)).toFixed(2),
        coupon: orderCoupon ? {
          code: orderCoupon.coupon.code,
          discount: orderCoupon.discount_amount.toFixed(2)
        } : null,
        total: order.total.toFixed(2),
        company: {
          name: process.env.COMPANY_NAME || 'Your Company',
          address: process.env.COMPANY_ADDRESS || '123 Business Street',
          email: process.env.COMPANY_EMAIL || 'info@company.com'
        }
      };

      const html = template(invoiceData);

      // Generate PDF
      return new Promise((resolve, reject) => {
        const pdfOptions = {
          format: 'A4',
          border: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          },
          timeout: 60000
        };

        pdf.create(html, pdfOptions).toBuffer((err, buffer) => {
          if (err) {
            this.logger.error(`PDF generation failed: ${err.message}`);
            reject(err);
          } else {
            resolve(buffer);
          }
        });
      });
    } catch (error) {
      this.logger.error(`Invoice generation failed: ${error.message}`);
      throw error;
    }
  }

  async sendInvoiceEmail(email: string, order: any, payment: any): Promise<void> {
    try {
      // Generate PDF invoice
      const pdfBuffer = await this.generateInvoicePdf(order, payment);

      // Prepare email template
      const emailTemplatePath = path.join(__dirname, '../../templates/email-invoice.hbs');

      // Create default email template if it doesn't exist
      if (!fs.existsSync(emailTemplatePath)) {
        const defaultEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .order-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .items { margin-bottom: 20px; }
    .total { font-weight: bold; font-size: 18px; }
    .discount { color: #27ae60; margin: 10px 0; }
    .footer { margin-top: 30px; text-align: center; color: #777; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>Thank you for your order!</h2>
    <p>Your invoice is attached to this email.</p>
  </div>

  <div class="order-info">
    <p><strong>Order #:</strong> {{orderNumber}}</p>
    <p><strong>Date:</strong> {{orderDate}}</p>
  </div>

  <div class="items">
    <h3>Order Summary:</h3>
    <ul>
      {{#each items}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>

  {{#if couponDiscount}}
  <div class="discount">
    <p><strong>Discount Applied:</strong> {{couponCode}} (-৳{{couponDiscount}})</p>
  </div>
  {{/if}}

  <div class="total">
    <p>Total: ৳{{totalAmount}}</p>
  </div>

  <div class="footer">
    <p>If you have any questions, please contact our support team.</p>
  </div>
</body>
</html>
        `;
        fs.writeFileSync(emailTemplatePath, defaultEmailTemplate);
      }

      const emailTemplateContent = fs.readFileSync(emailTemplatePath, 'utf8');
      const emailTemplate = compile(emailTemplateContent);

      // Prepare email data with coupon information
      const orderCoupon = order.OrderCoupon?.[0];
      const emailData = {
        orderNumber: order.id,
        orderDate: new Date(order.created_at).toLocaleDateString(),
        items: order.OrderItem?.map(item => item.name) || [order.service_type || 'Service'],
        totalAmount: order.total.toFixed(2),
        couponDiscount: orderCoupon?.discount_amount?.toFixed(2),
        couponCode: orderCoupon?.coupon?.code
      };

      const html = emailTemplate(emailData);

      // Send email with attachment
      await this.nodemailerTransport.sendMail({
        from: `"${process.env.SENDER_EMAIL || 'Company'}" <${process.env.EMAIL_FROM_ADDRESS || 'no-reply@company.com'}>`,
        to: email,
        subject: `Your Invoice for Order #${order.id}`,
        html: html,
        attachments: [{
          filename: `invoice-${order.id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      });

      this.logger.log(`Invoice email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send invoice email: ${error.message}`);
      throw error;
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