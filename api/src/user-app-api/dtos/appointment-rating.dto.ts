import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max,Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'Rating value (1-5 stars)',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Optional comment about the appointment',
    example: 'Great session! Very helpful.',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'ID of the appointment being rated',
    example: 1,
  })
  @IsInt()
  appointment_id: number;
}

// src/ratings/dto/rating-response.dto.ts

export class RatingResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5 })
  rating: number;

  @ApiProperty({ example: 'Great session! Very helpful.', required: false })
  comment?: string;

  @ApiProperty({ example: 1 })
  user_id: number;

  @ApiProperty({ example: 1 })
  consultant_id: number;

  @ApiProperty({ example: 1 })
  appointment_id: number;

  @ApiProperty({ example: '2023-10-15T10:30:00.000Z' })
  created_at: Date;
}