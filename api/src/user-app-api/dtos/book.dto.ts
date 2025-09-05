// book.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class BookResponseDto {
  @ApiProperty({ description: 'Book ID' })
  id: number;

  @ApiPropertyOptional({ description: 'Book title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Book description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'ISBN number' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ description: 'Book price' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: 'Book writer/author' })
  @IsOptional()
  @IsString()
  writer?: string;

  @ApiPropertyOptional({ description: 'Book category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Book image URL' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: 'Whether the book is available' })
  @IsOptional()
  @IsBoolean()
  is_available?: boolean;
}

export class BookListResponseDto {
  @ApiProperty({ 
    description: 'List of books',
    type: [BookResponseDto] 
  })
  books: BookResponseDto[];

  @ApiProperty({ description: 'Total count of books' })
  total: number;
}