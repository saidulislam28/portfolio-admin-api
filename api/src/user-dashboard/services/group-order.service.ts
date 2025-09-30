import { Injectable } from '@nestjs/common';
import { ServiceType } from '@prisma/client';
import { GroupedOrdersResponseDto, OrderDto } from '../dto/group-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserOrdersService {
  constructor(private prisma: PrismaService) { }

  async getUserOrdersGroupedByServiceType(userId: number): Promise<GroupedOrdersResponseDto> {
    const orders = await this.prisma.order.findMany({
      where: {
        user_id: userId,
        // is_archive: false,
        service_type: {
          notIn: [ServiceType.conversation, ServiceType.speaking_mock_test] // Filter out unwanted types
        }
      },
      include: {
        OrderItem: {
          include: {
            Book: {
              select: {
                id: true,
                title: true,
                isbn: true,
                writer: true,
                category: true,
              },
            },
          },
        },
        Package: {
          select: {
            id: true,
            name: true,
            class_count: true,
            sessions_count: true,
            service_type: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Group orders by service_type
    const groupedOrders = orders.reduce((acc, order) => {
      const serviceType = order.service_type;
      if (!acc[serviceType]) {
        acc[serviceType] = [];
      }

      const orderDto: OrderDto = {
        id: order.id,
        first_name: order.first_name,
        last_name: order.last_name,
        email: order.email,
        service_type: order.service_type,
        status: order.status,
        payment_status: order.payment_status,
        total: order.total,
        created_at: order.created_at,
        items: order.OrderItem.map(item => ({
          id: item.id,
          qty: item.qty,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
          book: item.Book ? {
            id: item.Book.id,
            title: item.Book.title,
            isbn: item.Book.isbn,
            writer: item.Book.writer,
            category: item.Book.category,
          } : undefined,
        })),
        package: order.Package ? {
          id: order.Package.id,
          name: order.Package.name,
          class_count: order.Package.class_count,
          sessions_count: order.Package.sessions_count,
          service_type: order.Package.service_type,
        } : undefined,
      };

      acc[serviceType].push(orderDto);
      return acc;
    }, {} as Record<ServiceType, OrderDto[]>);

    // Wrap the grouped orders in a data property
    return {
      data: groupedOrders
    };
  }
}