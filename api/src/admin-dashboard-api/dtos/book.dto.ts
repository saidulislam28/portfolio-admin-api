import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsISBN,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'Book title',
    example: 'The Great Gatsby',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Book description',
    example: 'A classic novel about the American Dream',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'International Standard Book Number (ISBN)',
    example: '978-3-16-148410-0'
  })
  @IsOptional()
  @IsString()
  @IsISBN()
  isbn?: string;

  @ApiProperty({
    description: 'Book price',
    example: 29.99,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Availability status of the book',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  is_available?: boolean = true;
}

export class UpdateBookDto extends PartialType(CreateBookDto) { }

export class BookQueryDto {
  @ApiPropertyOptional({
    description: 'Search term to filter books by title, description, or ISBN',
    example: 'programming'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Number of records to skip for pagination',
    example: 0,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of records to return per page',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by availability status',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_available?: boolean;
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean;
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_verified?: boolean;
}

export class BookResponseDto {
  @ApiProperty({ description: 'Book ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Book title', example: 'The Great Gatsby' })
  title: string;

  @ApiPropertyOptional({ description: 'Book description', example: 'A classic novel about the American Dream' })
  description?: string;

  @ApiPropertyOptional({ description: 'International Standard Book Number (ISBN)', example: '978-3-16-148410-0' })
  isbn?: string;

  @ApiProperty({ description: 'Book price', example: 29.99 })
  price: number;

  @ApiProperty({ description: 'Availability status', example: true })
  is_available: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;
}

export class BookListResponseDto {
  @ApiProperty({
    type: [BookResponseDto],
    description: 'List of books'
  })
  data: BookResponseDto[];

  @ApiProperty({ description: 'Total count of books', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages: number;
}

// Additional DTOs for future use
export class BookAvailabilityDto {
  @ApiProperty({
    description: 'Availability status',
    example: true
  })
  @IsBoolean()
  is_available: boolean;
}

export class BookPriceUpdateDto {
  @ApiProperty({
    description: 'New book price',
    example: 39.99,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class BookSearchDto {
  @ApiProperty({
    description: 'Search query',
    example: 'fiction'
  })
  @IsString()
  query: string;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 50,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max_price?: number;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 10,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_price?: number;
}