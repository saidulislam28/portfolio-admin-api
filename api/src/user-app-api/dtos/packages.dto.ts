import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({ description: 'Package name', example: 'Premium Package' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Package description', example: 'Includes all features', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Package price', example: 99.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Sort order', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @ApiProperty({ description: 'Whether package is active', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

// Update Package DTO
export class UpdatePackageDto extends PartialType(CreatePackageDto) { }

// Package Response DTO
export class PackageResponseDto {
  @ApiProperty({ description: 'Package ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Package name', example: 'Premium Package' })
  name: string;

  @ApiProperty({ description: 'Package description', example: 'Includes all features', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Package price', example: 99.99 })
  price: number;

  @ApiProperty({ description: 'Sort order', example: 1 })
  sort_order: number;

  @ApiProperty({ description: 'Whether package is active', example: true })
  is_active: boolean;

  @ApiProperty({ description: 'Creation timestamp', example: '2023-12-01T10:00:00Z' })
  created_at: Date;

  @ApiProperty({ description: 'Update timestamp', example: '2023-12-01T10:00:00Z' })
  updated_at: Date;
}

// Exam Center Response DTO
export class ExamCenterResponseDto {
  @ApiProperty({ description: 'Exam Center ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Exam Center name', example: 'Main Exam Hall' })
  name: string;

  @ApiProperty({ description: 'Exam Center address', example: '123 Main St', nullable: true })
  address: string | null;

  @ApiProperty({ description: 'Sort order', example: 1 })
  sort_order: number;

  @ApiProperty({ description: 'Whether exam center is active', example: true })
  is_active: boolean;

  @ApiProperty({ description: 'Creation timestamp', example: '2023-12-01T10:00:00Z' })
  created_at: Date;

  @ApiProperty({ description: 'Update timestamp', example: '2023-12-01T10:00:00Z' })
  updated_at: Date;
}

// Packages Response DTO (for findAll response)
export class PackagesResponseDto {
  @ApiProperty({
    description: 'List of packages',
    type: [PackageResponseDto]
  })
  packages: PackageResponseDto[];

  @ApiProperty({
    description: 'List of exam centers',
    type: [ExamCenterResponseDto]
  })
  center: ExamCenterResponseDto[];
}

// Error Response DTO
export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP status code', example: 400 })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: 'Bad Request' })
  message: string;

  @ApiProperty({ description: 'Error details', example: 'Validation failed' })
  error: string;
}