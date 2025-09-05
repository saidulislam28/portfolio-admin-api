import { Injectable } from '@nestjs/common';
import { OrderPaymentStatus, ServiceType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BookOrderDetailResponseDto, BookOrderResponseDto } from '../dto/book-order.dto';

@Injectable()
export class AppBookOrderService {
  constructor(private prisma: PrismaService) { }

  async findAll(user_id: number): Promise<BookOrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        service_type: ServiceType.book_purchase,
        user_id: Number(user_id),
        payment_status: OrderPaymentStatus.paid
      },
      include: {
        User: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true
          }
        },
        OrderItem: {
          include: {
            Book: {
              select: {
                id: true,
                title: true,
                writer: true,
                price: true,
                isbn: true
              }
            }
          }
        },
        Payment: {
          select: {
            order_id: true,
            payment_method: true,
            transaction_id: true,
            paid_at: true
          }
        },
      }
    });

    // Transform the Payment array to single PaymentDto or null
    return orders.map(order => ({
      ...order,
      Payment: order.Payment.length > 0 ? order.Payment[0] : null
    }));
  }

  async findOne(user_id: number, id: number): Promise<BookOrderDetailResponseDto> {
    const response = await this.prisma.order.findFirst({
      where: {
        service_type: ServiceType.book_purchase,
        user_id,
        id
      },
      include: {
        User: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true
          }
        },
        OrderItem: {
          include: {
            Book: {
              select: {
                id: true,
                title: true,
                writer: true,
                price: true,
                isbn: true
              }
            }
          }
        },
        Payment: {
          select: {
            order_id: true,
            payment_method: true,
            transaction_id: true,
            paid_at: true
          }
        },
      }
    });

    if (!response) {
      return null;
    }

    // Transform the Payment array to single PaymentDto or null
    return {
      ...response,
      Payment: response.Payment.length > 0 ? response.Payment[0] : null
    };
  }
}