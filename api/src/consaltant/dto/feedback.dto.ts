import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class FeedbackCommentResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the feedback comment',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'The feedback comment text',
    example: 'Excellent communication skills'
  })
  comment: string;

  @ApiProperty({
    description: 'Sort order for display priority',
    example: 1
  })
  sort_order: number;

  @ApiProperty({
    description: 'Indicates if the feedback comment is active',
    example: true
  })
  is_active: boolean;

  @ApiProperty({ description: 'Timestamp when the feedback comment was created' })
  created_at: Date;

  @ApiProperty({ description: 'Timestamp when the feedback comment was last updated' })
  updated_at: Date;
}

export class CreateFeedbackCommentDto {
  @ApiProperty({
    description: 'The feedback comment text',
    example: 'Excellent communication skills',
    maxLength: 500
  })
  @IsString()
  @MaxLength(500)
  comment: string;

  @ApiPropertyOptional({
    description: 'Sort order for display priority (defaults to last + 1 if not provided)',
    example: 5,
    minimum: 0
  })
  @IsNumber()
  @IsOptional()
  sort_order?: number;

  @ApiPropertyOptional({
    description: 'Indicates if the feedback comment is active (defaults to true)',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}