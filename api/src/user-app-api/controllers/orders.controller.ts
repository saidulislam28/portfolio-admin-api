/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, HttpStatus,NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiParam,ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  BookPurchaseResponseDto,
  ConversationResponseDto,
  ExamRegistrationResponseDto,
  GenericOrderResponseDto,
  IeltsAcademicResponseDto,
  OrderDetailsResponse,
  SpeakingMockTestResponseDto} from '../dtos/order-details.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':orderId/details')
  @ApiOperation({ 
    summary: 'Get order details by ID',
    description: 'Retrieves detailed information about an order based on its service type. Returns different data structures\
     depending on the service type. \
    this is used in the user app\'s payment success page'
  })
  @ApiParam({
    name: 'orderId',
    description: 'Unique order identifier',
    type: 'string'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order details retrieved successfully',
    schema: {
      oneOf: [
        { $ref: '#/components/schemas/SpeakingMockTestResponseDto' },
        { $ref: '#/components/schemas/ConversationResponseDto' },
        { $ref: '#/components/schemas/BookPurchaseResponseDto' },
        { $ref: '#/components/schemas/ExamRegistrationResponseDto' },
        { $ref: '#/components/schemas/IeltsAcademicResponseDto' },
        { $ref: '#/components/schemas/GenericOrderResponseDto' }
      ]
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found'
  })
  async getOrderDetails(@Param('orderId') orderId: string): Promise<OrderDetailsResponse> {
    // Parse orderId to number if it's numeric
    const orderIdNum = parseInt(orderId);
    if (isNaN(orderIdNum)) {
      throw new NotFoundException('Invalid order ID format');
    }

    // Fetch order with related data
    const order = await this.prisma.order.findUnique({
      where: { id: orderIdNum },
      include: {
        User: true,
        Package: true,
        ExamCenter: true,
        OrderItem: {
          include: {
            Book: true
          }
        },
        Appointment: {
          include: {
            Consultant: true
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Generate response based on service type
    return this.generateOrderDetailsResponse(order);
  }

  private generateOrderDetailsResponse(order: any): OrderDetailsResponse {
    const baseData = {
      createdAt: order.created_at?.toISOString() || new Date().toISOString()
    };

    switch (order.service_type) {
      case ServiceType.speaking_mock_test:
        return this.generateSpeakingMockTestResponse(order, baseData);
      
      case ServiceType.conversation:
        return this.generateConversationResponse(order, baseData);
      
      case ServiceType.book_purchase:
        return this.generateBookPurchaseResponse(order, baseData);
      
      case ServiceType.exam_registration:
        return this.generateExamRegistrationResponse(order, baseData);
      
      case ServiceType.ielts_academic:
        return this.generateIeltsAcademicResponse(order, baseData);
      
      case ServiceType.ielts_gt:
      case ServiceType.spoken:
      case ServiceType.study_abroad:
      default:
        return this.generateGenericOrderResponse(order, baseData);
    }
  }

  private generateSpeakingMockTestResponse(order: any, baseData: any): SpeakingMockTestResponseDto {
    const appointments = order.Appointment?.map(apt => ({
      appointmentId: apt.id.toString(),
      date: apt.slot_date ? new Date(apt.slot_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      time: apt.slot_time || ''
    })) || [];

    return {
      title: "Appointments Booked!",
      subtitle: `🎉 Congratulations! Your English speaking test ${appointments.length > 1 ? 'appointments have' : 'appointment has'} been successfully scheduled`,
      cardTitle: "Test Appointment Details",
      icon: "calendar",
      appointments,
      ...baseData
    };
  }

  private generateConversationResponse(order: any, baseData: any): ConversationResponseDto {
    const appointments = order.Appointment?.map(apt => ({
      appointmentId: apt.id.toString(),
      date: apt.slot_date ? new Date(apt.slot_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      time: apt.slot_time || ''
    })) || [];

    return {
      title: "Conversation Appointments Booked!",
      subtitle: `🎉 Congratulations! Your English Conversation ${appointments.length > 1 ? 'appointments have' : 'appointment has'} been successfully scheduled`,
      cardTitle: "Conversation Appointment Details",
      icon: "calendar",
      appointments,
      ...baseData
    };
  }

  private generateBookPurchaseResponse(order: any, baseData: any): BookPurchaseResponseDto {
    const items = order.OrderItem?.map(item => ({
      name: item.Book?.title || 'Unknown Book',
      quantity: item.qty || 0,
      price: item.unit_price || 0
    })) || [];

    return {
      title: "Books Purchased!",
      subtitle: "📚 Your book purchase is complete! Happy reading!",
      cardTitle: "Purchase Details",
      icon: "book",
      orderId: order.id.toString(),
      purchaseDate: order.date ? new Date(order.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      items,
      totalPrice: order.total || 0,
      tip: "💡 You'll receive a tracking number via email once shipped",
      ...baseData
    };
  }

  private generateExamRegistrationResponse(order: any, baseData: any): ExamRegistrationResponseDto {
    const items = [{
      name: "IELTS Academic",
      quantity: 1,
      price: 215.00
    }];

    // Add any additional fees from order items
    if (order.OrderItem?.length > 0) {
      order.OrderItem.forEach(item => {
        if (item.Book?.title) {
          items.push({
            name: item.Book.title,
            quantity: item.qty || 1,
            price: item.unit_price || 0
          });
        }
      });
    }

    return {
      title: "IELTS Exam Registration Complete!",
      subtitle: "🎓 Your IELTS exam registration was successful. Good luck with your preparation!",
      cardTitle: "Exam Details",
      icon: "edit",
      registrationId: order.id.toString(),
      examDate: order.date ? new Date(order.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      items,
      totalPrice: order.total || 0,
      ...baseData
    };
  }

  private generateIeltsAcademicResponse(order: any, baseData: any): IeltsAcademicResponseDto {
    return {
      title: "IELTS Academic Class Booked!",
      subtitle: "👩‍🏫 Your online class has been scheduled. We'll see you there!",
      cardTitle: "Class Details",
      icon: "video",
      orderId: order.id.toString(),
      ...baseData
    };
  }

  private generateGenericOrderResponse(order: any, baseData: any): GenericOrderResponseDto {
    return {
      title: "Order Complete!",
      subtitle: "✅ Your transaction was completed successfully",
      cardTitle: "Order Details",
      icon: "check-circle",
      orderId: order.id.toString(),
      date: order.date ? new Date(order.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      ...baseData
    };
  }
}