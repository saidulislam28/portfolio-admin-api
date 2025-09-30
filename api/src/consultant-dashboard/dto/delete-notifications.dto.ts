import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class DeleteNotificationsDto {
  @ApiProperty({
    description: 'Array of notification IDs to delete',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  notificationIds: number[];
}