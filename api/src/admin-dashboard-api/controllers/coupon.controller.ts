// src/coupons/coupons.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus, 
  NotFoundException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { CouponsService } from '../services/coupon.service';
import { ApplyCouponDto, ApplyCouponResponseDto, CouponResponseDto, CreateCouponDto, UpdateCouponDto } from '../dtos/coupon.dto';


@ApiTags('Admin: Coupons')
@ApiBearerAuth()
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Coupon created successfully',
    type: CouponResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input or coupon code already exists' 
  })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of coupons',
    type: [CouponResponseDto] 
  })
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a coupon by ID' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Coupon details',
    type: CouponResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Coupon not found' 
  })
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a coupon' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Coupon updated successfully',
    type: CouponResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Coupon not found' 
  })
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(+id, updateCouponDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a coupon' })
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Coupon deleted successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Coupon not found' 
  })
  remove(@Param('id') id: string) {
    return this.couponsService.remove(+id);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply a coupon to an order' })
  @ApiBody({ type: ApplyCouponDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Coupon application result',
    type: ApplyCouponResponseDto 
  })
  applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
    return this.couponsService.applyCoupon(applyCouponDto);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get coupon by code' })
  @ApiParam({ name: 'code', description: 'Coupon code' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Coupon details',
    type: CouponResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Coupon not found' 
  })
  async findByCode(@Param('code') code: string) {
    const coupon = await this.couponsService['prisma'].coupon.findUnique({
      where: { code },
      include: {
        coupon_categories: true,
        coupon_users: true,
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return this.couponsService['mapToResponseDto'](coupon);
  }
}