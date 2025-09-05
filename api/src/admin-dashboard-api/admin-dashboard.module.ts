import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { QUEUE_NAME } from "src/common/constants";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { AppointmentsController } from "./controllers/appoinments.controller";
import { BookingController } from "./controllers/bookings.controller";
import { LiveAppointmentController } from "./controllers/live-appointment.controller";
import { SendOrderController } from "./controllers/send-order.controller";
import { AppointmentsService } from "./services/appoinments.service";
import { BookingService } from "./services/bookings.service";
import { LiveAppointmentService } from "./services/live-appointment.service";
import { SendOrderService } from "./services/send-order.service";
import { CouponsService } from "./services/coupon.service";
import { CouponsController } from "./controllers/coupon.controller";
import { ConsultantScheduleController } from "./controllers/consultant-schedule.controller";
import { ConsultantScheduleService } from "./services/consultant-schedule.service";

@Module({
    imports: [
        ConfigModule,
        BullModule.registerQueueAsync({
            name: QUEUE_NAME,
        }),
        PrismaModule
    ],
    controllers: [AppointmentsController, LiveAppointmentController, BookingController, SendOrderController, CouponsController, ConsultantScheduleController],
    providers: [AppointmentsService, PrismaService, LiveAppointmentService, BookingService, SendOrderService, CouponsService, ConsultantScheduleService],
    exports: [AppointmentsService,
        CouponsService
    ]
})
export class AdminDashboardModule { }