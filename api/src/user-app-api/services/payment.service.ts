import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AppointmentStatus, OrderPaymentStatus, PAYMENT_STATUS, ServiceType } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';

import { OrdersService } from '../../user-dashboard/services/orders.service';
import { SSLCommerzCallbackDto } from '../dtos/sslcommerz-callback.dto';
import { QUEUE_JOBS, QUEUE_NAME } from 'src/common/constants';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private prismaService: PrismaService,
    private orderService: OrdersService,
    @InjectQueue(QUEUE_NAME) private emailQueue: Queue,
  ) { }

  async verifyPayment(payload: SSLCommerzCallbackDto) {
    this.logger.log(`Starting payment verification for transaction: ${payload.tran_id}`);
    try {
      
      const order = await this.prismaService.order.findFirst({
        where: {
          sslc_transaction_id: payload.tran_id
        }
      });
      
      // update order status
      await this.prismaService.order.update({
        where: { id: order.id },
        data: {
          payment_status: OrderPaymentStatus.paid,
        }
      });

      // update appointment status
      if(order.service_type === ServiceType.speaking_mock_test
        || order.service_type === ServiceType.conversation
      ) {
        await this.prismaService.appointment.updateMany({
          where: { order_id: order.id },
          data: {
            status: AppointmentStatus.PENDING,
          }
        });
      }

      await this.addInvoiceEmailToQueue(order?.id);

    } catch (error) {
      this.logger.error(`Payment verification failed: ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async addInvoiceEmailToQueue(order_id: number) {
    

    try {
      const job = await this.emailQueue.add(QUEUE_JOBS.send_payment_invoice, {
        orderId: order_id,
      });
      // const job = await this.emailQueue.add(QUEUE_JOBS.send_payment_invoice, {
      //   order_id: order_id,
      //   order,
      //   payment,
      //   paymentCallback,
      //   serviceType: order.service_type, // Assuming service_type is in orders table
      //   timestamp: new Date().toISOString()
      // }, {
      //   attempts: 3,
      //   backoff: {
      //     type: 'exponential',
      //     delay: 5000
      //   },
      //   removeOnComplete: true,
      //   removeOnFail: true,
      //   delay: 2000 // Small delay to ensure database consistency
      // });

      this.logger.debug(`Invoice email job created with ID: ${job.id}`);
      return job;
    } catch (error) {
      this.logger.error(`Failed to add invoice email job to queue: ${error.message}`);
      throw error;
    }
  }

  async paymentFailed(tran_id: string, paymentStatus) {
    const findPayment = await this.prismaService.payment.findFirst({
      where: {
        transaction_id: tran_id
      }
    });

    if (!findPayment) {
      throw new HttpException(
        'Payment Not Found',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatePayment = await this.prismaService.payment.update({
      where: { id: findPayment.id },
      data: { status: paymentStatus }
    });

    return updatePayment;
  }

  async checkPayment(tran_id: string,) {
    const findPayment = await this.prismaService.payment.findFirst({
      where: {
        transaction_id: tran_id
      }
    });

    if (!findPayment) {
      throw new HttpException(
        'Payment Not Found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (findPayment.status === PAYMENT_STATUS.PAID) {
      return {
        payment_id: findPayment.id,
        order_id: findPayment.order_id
      }
    }

    throw new HttpException(
      `Payment ${findPayment.status?.toLocaleLowerCase()}`,
      HttpStatus.NOT_FOUND,
    );
  }
}