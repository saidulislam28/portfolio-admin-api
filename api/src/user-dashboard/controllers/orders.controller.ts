import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';

import { CreateOrderDto, CreateOrderResponseDto } from '../dto/order.dto';
import { OrdersService } from '../services/orders.service';
import { Role } from 'src/user-auth/dto/role.enum';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';


@ApiTags('User: Orders')
@ApiBearerAuth()
@Controller('orders')
@HasRoles(Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new service order',
    description: 'Creates a new order with payment processing. Returns payment URL for completion.'
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Order creation payload including items, appointments, and customer details'
  })
  @ApiCreatedResponse({
    type: CreateOrderResponseDto,
    description: 'Order created successfully, returns paymejnt URL'
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or validation failed' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error during order creation' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions'
  })
  async create(@Body() payload: CreateOrderDto, @Req() req) {
    const { id } = req?.user;
    const protocol = req.protocol;
    const host = req.get('Host');
    const baseUrl = `${protocol}://${host}`;
    // console.log("order payload", payload)
    const response = await this.ordersService.createOrder(payload, +id, baseUrl);
    return res.success(response);
  }
}