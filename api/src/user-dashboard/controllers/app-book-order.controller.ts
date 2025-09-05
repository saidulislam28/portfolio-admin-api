import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { JwtAuthGuard } from 'src/user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/user-auth/jwt/roles.guard';
import { AppBookOrderService } from '../services/app-book-order.service';
import { BookOrderDetailResponseDto, BookOrderResponseDto } from '../dto/book-order.dto';
import { HasRoles } from 'src/user-auth/jwt/has-roles.decorator';
import { Role } from 'src/user-auth/dto/role.enum';

@ApiTags('User: App book Order')
@ApiBearerAuth()
@Controller('app/book-order')
@HasRoles(Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppBookOrderController {
  constructor(private readonly appBookOrderService: AppBookOrderService) { }

  @Get()
  @ApiOperation({ summary: 'Get all book orders for the authenticated user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns list of book orders',
    type: [BookOrderResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async findAll(@Req() req) {
    const { id: user_id } = req?.user;
    const response = await this.appBookOrderService.findAll(+user_id);
    return res.success(response)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific book order details' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns book order details',
    type: BookOrderDetailResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Book order not found' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Book order ID' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const { id: user_id } = req?.user;
    const response = await this.appBookOrderService.findOne(+user_id, +id);
    return res.success(response)
  }
}