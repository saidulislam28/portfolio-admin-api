import { Injectable, Logger, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCacheService } from '../../user-cache/interfaces/user-cache.interface';
import { UserUpdatedEvent } from '../events/user-updated.event';
import { BulkUserUpdatedEvent } from '../events/bulk-user-updated.event';

@Injectable()
export class CacheInvalidationListener {
  private readonly logger = new Logger(CacheInvalidationListener.name);

  constructor(
    @Inject('UserCacheService') private userCacheService: UserCacheService,
  ) {}

  @OnEvent('user.updated')
  async handleUserUpdated(event: UserUpdatedEvent) {
    try {
      await this.userCacheService.invalidateUserInfo(event.userId, event.userType);
      this.logger.log(
        `Cache invalidated for ${event.userType} ${event.userId} due to fields: ${event.updatedFields.join(', ')}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to invalidate cache for ${event.userType} ${event.userId}:`,
        error
      );
    }
  }

  @OnEvent('user.bulk-updated')
  async handleBulkUserUpdated(event: BulkUserUpdatedEvent) {
    try {
      const userIds = event.users.map(user => ({ id: user.id, type: user.type }));
      await this.userCacheService.bulkInvalidateUserInfo(userIds);
      this.logger.log(`Bulk cache invalidated for ${userIds.length} users`);
    } catch (error) {
      this.logger.error('Failed to bulk invalidate cache:', error);
    }
  }
}


// src/user/user.controller.ts (Example usage)
// import { Controller, Put, Param, Body, UseInterceptors } from '@nestjs/common';
// import { InvalidateCache } from '../common/decorators/invalidate-cache.decorator';
// import { CacheInvalidationInterceptor } from '../common/interceptors/cache-invalidation.interceptor';

// @Controller('users')
// @UseInterceptors(CacheInvalidationInterceptor)
// export class UserController {
  
//   @Put(':id')
//   @InvalidateCache({
//     userIdParam: 'id',
//     userTypeParam: 'type',
//     condition: (result, params) => {
//       // Only invalidate if timezone or token was updated
//       return params.body.timezone !== undefined || params.body.token !== undefined;
//     }
//   })
//   async updateUser(@Param('id') id: string, @Body() updateData: any) {
//     // Update user logic
//     return { success: true };
//   }

//   @Put(':id/timezone')
//   @InvalidateCache({
//     userIdParam: 'id',
//     condition: () => true, // Always invalidate for timezone updates
//   })
//   async updateUserTimezone(@Param('id') id: string, @Body() timezoneData: any) {
//     // Update timezone logic
//     return { success: true };
//   }
// }

// // src/consultant/consultant.controller.ts (Example usage)
// import { Controller, Put, Param, Body, UseInterceptors } from '@nestjs/common';
// import { InvalidateCache } from '../common/decorators/invalidate-cache.decorator';
// import { CacheInvalidationInterceptor } from '../common/interceptors/cache-invalidation.interceptor';

// @Controller('consultants')
// @UseInterceptors(CacheInvalidationInterceptor)
// export class ConsultantController {
  
//   @Put(':id')
//   @InvalidateCache({
//     userIdParam: 'id',
//     condition: (result, params) => {
//       // Only invalidate if timezone or token was updated
//       return params.body.timezone !== undefined || params.body.token !== undefined;
//     }
//   })
//   async updateConsultant(@Param('id') id: string, @Body() updateData: any) {
//     // Set userType to consultant in the body for the interceptor
//     updateData.type = 'consultant';
//     // Update consultant logic
//     return { success: true };
//   }
// }