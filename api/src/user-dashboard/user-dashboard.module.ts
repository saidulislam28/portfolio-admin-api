import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleNotificationsModule } from "src/schedule-notification/schedule-notifications.module";
import { PaymentService } from "src/user-app-api/services/payment.service";

import { AppBookOrderController } from "./controllers/app-book-order.controller";
import { OrdersController } from "./controllers/orders.controller";
import { UsersController } from "./controllers/user.controller";
import { AppBookOrderService } from "./services/app-book-order.service";
import { OrdersService } from "./services/orders.service";
import { UserService } from "./services/user.service";
import { QUEUE_NAME } from "src/common/constants";
import { CouponController } from "./controllers/coupon.controller";
import { CouponService } from "./services/coupon.service";
import { UserOrdersService } from "./services/group-order.service";
import { UserOrdersController } from "./controllers/group-order.controller";
import { NotificationsService } from "./services/user-notification.service";
import { NotificationsController } from "./controllers/user-notification.controller";

@Module({
  imports: [ScheduleNotificationsModule, ConfigModule,
    BullModule.registerQueue({ name: QUEUE_NAME }),
  ],
  controllers: [AppBookOrderController, OrdersController, UsersController, CouponController, UserOrdersController, NotificationsController],
  providers: [
    AppBookOrderService, OrdersService, UserService, PaymentService, CouponService, UserOrdersService, NotificationsService
  ],
  exports: [OrdersService, UserService],
})
export class UserDashboardModule { }