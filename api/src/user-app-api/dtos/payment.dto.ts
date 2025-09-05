import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';

export class InitiatePaymentDto {
  @IsNumber()
  total_amount: number;

  @IsString()
  currency: string;

  @IsString()
  tran_id: string;

  @IsString()
  product_name: string;

  @IsString()
  product_category: string;

  @IsString()
  cus_name: string;

  @IsEmail()
  cus_email: string;

  @IsString()
  cus_add1: string;

  @IsString()
  cus_city: string;

  @IsString()
  cus_state: string;

  @IsString()
  cus_postcode: string;

  @IsString()
  cus_country: string;

  @IsString()
  cus_phone: string;

  @IsOptional()
  @IsString()
  success_url?: string;

  @IsOptional()
  @IsString()
  fail_url?: string;

  @IsOptional()
  @IsString()
  cancel_url?: string;
}