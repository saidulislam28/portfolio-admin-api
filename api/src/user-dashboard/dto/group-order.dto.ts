// src/orders/dto/order-response.dto.ts
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ServiceType, OrderStatus, OrderPaymentStatus } from '@prisma/client';

export class OrderItemDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 2 })
    qty: number;

    @ApiProperty({ example: 500 })
    unit_price: number;

    @ApiProperty({ example: 1000 })
    subtotal: number;

    @ApiProperty({ example: { title: 'IELTS Preparation Book', isbn: '1234567890' } })
    book?: any;
}

export class OrderDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'John' })
    first_name?: string;

    @ApiProperty({ example: 'Doe' })
    last_name?: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    email?: string;

    @ApiProperty({ example: 'IELTS_ACADEMIC' })
    service_type: ServiceType;

    @ApiProperty({ example: 'PENDING' })
    status?: OrderStatus;

    @ApiProperty({ example: 'PAID' })
    payment_status?: OrderPaymentStatus;

    @ApiProperty({ example: 1000 })
    total?: number;

    @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
    created_at?: Date;

    @ApiProperty({ type: [OrderItemDto] })
    items?: OrderItemDto[];

    @ApiProperty({ example: { name: 'IELTS Package', class_count: 10 } })
    package?: any;
}

export class GroupedOrdersResponseDto {
    @ApiProperty({
        example: {
            // IELTS_ACADEMIC: [
            //     {
            //         id: 1,
            //         first_name: 'John',
            //         last_name: 'Doe',
            //         service_type: 'IELTS_ACADEMIC',
            //         status: 'PENDING',
            //         total: 1000,
            //         created_at: '2024-01-15T10:30:00.000Z',
            //     },
            // ],
            // CONVERSATION: [
            //     {
            //         id: 2,
            //         first_name: 'Jane',
            //         last_name: 'Smith',
            //         service_type: 'CONVERSATION',
            //         status: 'APPROVED',
            //         total: 1500,
            //         created_at: '2024-01-16T14:20:00.000Z',
            //     },
            // ],
        },
        type: 'object',
        additionalProperties: { type: 'array', items: { $ref: getSchemaPath(OrderDto) } },
    })
    data: Record<string, OrderDto[]>;
}