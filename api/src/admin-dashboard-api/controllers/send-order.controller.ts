// src/orders/order.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { res } from 'src/common/response.helper';

import { SendOrderResponseDto, SendOrderToVendorDto } from '../dtos/send-order.dto';
import { SendOrderService } from '../services/send-order.service';

@ApiTags('Vendor Orders')
@Controller('vendor-orders')
export class SendOrderController {
    constructor(private readonly orderService: SendOrderService) { }

    @Post('send-to-vendor')
    @ApiOperation({
        summary: 'Send order to vendor',
        description: 'Sends a specific order to a vendor for processing'
    })
    @ApiBody({
        type: SendOrderToVendorDto,
        description: 'Order and vendor details'
    })
    @ApiResponse({
        status: 200,
        description: 'Order sent to vendor successfully',
        type: SendOrderResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - invalid input data'
    })
    @ApiResponse({
        status: 404,
        description: 'Vendor or order not found'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error'
    })
    async sendToVendor(@Body() dto: SendOrderToVendorDto) {
        const response = await this.orderService.sendOrderToVendor(dto.vendor_id, dto.order_id);
        return res.success(response);
    }
}