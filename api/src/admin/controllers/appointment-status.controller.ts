import { Body, Controller, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { AppointmentStatusService } from "../services/appointment-status.service";
import { res } from "src/common/response.helper";

@Controller('/cancel-appointment')
export class AppointmentStatusController {
    constructor(private readonly appointmentStatus: AppointmentStatusService) { }

    @Patch(':id')
    async cancelAppointment(@Body() data,
        @Param('id', ParseIntPipe) id: number) {
        const response = await this.appointmentStatus.cancelAppointment(id, data);
        return res.success(response);
    }
}