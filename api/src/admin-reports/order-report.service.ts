import { BadRequestException,Injectable } from '@nestjs/common';
import { OrderStatus,ServiceType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { 
  OrderReportsQueryDto, 
  OrderReportsResponseDto, 
  OrderSummaryDto,
  PaymentMethodStatsDto,
  ServiceTypeStatsDto
} from './dto/order-report.dto';

@Injectable()
export class OrderReportsService {
  constructor(private prisma: PrismaService) {}

  async generateOrderReport(query: OrderReportsQueryDto): Promise<OrderReportsResponseDto> {
    const { startDate, endDate, reportPeriod } = this.validateAndParseDates(query);
    
    // Build where clause
    const whereClause: any = {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
      is_archive: false,
    };

    if (query.service_type) {
      whereClause.service_type = query.service_type;
    }

    // Fetch all orders in the date range
    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        User: {
          select: {
            id: true,
            email: true,
          },
        },
        Package: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Fetch cancelled orders separately
    const cancelledOrders = await this.prisma.order.findMany({
      where: {
        ...whereClause,
        status: OrderStatus.Canceled, // Adjust enum value as needed
        canceled_at: {
          not: null,
        },
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        canceled_at: 'desc',
      },
    });

    // Calculate metrics
    const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalCancelledAmount = cancelledOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalRevenue = totalSales - totalCancelledAmount;
    const averageOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

    // Payment method statistics
    const paymentStats = this.calculatePaymentStats(orders);

    // Service type statistics (only if no specific service type filter is applied)
    const serviceTypeStats = query.service_type 
      ? [] 
      : await this.calculateServiceTypeStats(whereClause);

    // Transform orders to DTO format
    const orderSummaries = this.transformOrdersToSummary(orders);
    const cancelledOrderSummaries = this.transformOrdersToSummary(cancelledOrders);

    return {
      report_period: reportPeriod,
      service_type_filter: query.service_type,
      total_sales: Number(totalSales.toFixed(2)),
      total_orders: orders.length,
      total_cancelled_amount: Number(totalCancelledAmount.toFixed(2)),
      cancelled_orders_count: cancelledOrders.length,
      average_order_value: Number(averageOrderValue.toFixed(2)),
      total_revenue: Number(totalRevenue.toFixed(2)),
      payment_stats: paymentStats,
      service_type_stats: serviceTypeStats,
      orders: orderSummaries,
      cancelled_orders: cancelledOrderSummaries,
    };
  }

  private validateAndParseDates(query: OrderReportsQueryDto) {
    let startDate: Date;
    let endDate: Date;
    let reportPeriod: string;

    if (query.date) {
      // Single day report
      startDate = new Date(`${query.date}T00:00:00.000Z`);
      endDate = new Date(`${query.date}T23:59:59.999Z`);
      reportPeriod = query.date;
    } else if (query.start_date && query.end_date) {
      // Date range report
      startDate = new Date(`${query.start_date}T00:00:00.000Z`);
      endDate = new Date(`${query.end_date}T23:59:59.999Z`);
      reportPeriod = `${query.start_date} to ${query.end_date}`;

      if (startDate > endDate) {
        throw new BadRequestException('Start date must be before or equal to end date');
      }
    } else {
      throw new BadRequestException('Either provide a single date or both start_date and end_date');
    }

    // Validate dates are not in the future
    const now = new Date();
    if (startDate > now) {
      throw new BadRequestException('Cannot generate report for future dates');
    }

    return { startDate, endDate, reportPeriod };
  }

  private calculatePaymentStats(orders: any[]): PaymentMethodStatsDto {
    let codOrders = 0;
    let onlineOrders = 0;
    let codAmount = 0;
    let onlineAmount = 0;

    orders.forEach(order => {
      if (order.cod) {
        codOrders++;
        codAmount += order.total || 0;
      } else {
        onlineOrders++;
        onlineAmount += order.total || 0;
      }
    });

    return {
      cod_orders: codOrders,
      online_orders: onlineOrders,
      cod_amount: Number(codAmount.toFixed(2)),
      online_amount: Number(onlineAmount.toFixed(2)),
    };
  }

  private async calculateServiceTypeStats(whereClause: any): Promise<ServiceTypeStatsDto[]> {
    const serviceTypeStats = await this.prisma.order.groupBy({
      by: ['service_type'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
    });

    return serviceTypeStats
      .filter(stat => stat.service_type !== null)
      .map(stat => ({
        service_type: stat.service_type as ServiceType,
        order_count: stat._count.id,
        total_revenue: Number((stat._sum.total || 0).toFixed(2)),
        average_order_value: Number((
          stat._count.id > 0 ? (stat._sum.total || 0) / stat._count.id : 0
        ).toFixed(2)),
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue);
  }

  private transformOrdersToSummary(orders: any[]): OrderSummaryDto[] {
    return orders.map(order => ({
      id: order.id,
      first_name: order.first_name || '',
      last_name: order.last_name || '',
      email: order.email || order.User?.email || '',
      status: order.status || '',
      payment_status: order.payment_status || '',
      service_type: order.service_type,
      total: Number((order.total || 0).toFixed(2)),
      created_at: order.created_at,
      cod: order.cod || false,
    }));
  }
}