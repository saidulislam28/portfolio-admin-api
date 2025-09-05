import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';


enum Order_Progress {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export class UpdateBookOrderDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  delivery_address?: string;

  @IsOptional()
  @IsEnum(Order_Progress)
  status?: Order_Progress;

  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  delivery_charge?: number;

  @IsOptional()
  @IsNumber()
  total?: number;
}