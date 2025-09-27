/* eslint-disable  */
import { Body, Controller, Param, ParseIntPipe, Patch, UseGuards } from "@nestjs/common";
import { AppointmentStatusService } from "../services/appointment-status.service";
import { res } from "src/common/response.helper";
import { HasRoles } from "src/user-auth/jwt/has-roles.decorator";
import { Role } from "src/user-auth/dto/role.enum";
import { JwtAuthGuard } from "src/user-auth/jwt/jwt-auth.guard";
import { RolesGuard } from "src/user-auth/jwt/roles.guard";

@Controller('/cancel-appointment')
@HasRoles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentStatusController {
    constructor(private readonly appointmentStatus: AppointmentStatusService) { }

    @Patch(':id')
    async cancelAppointment(@Body() data,
        @Param('id', ParseIntPipe) id: number) {
        const response = await this.appointmentStatus.cancelAppointment(id, data);
        return res.success(response);
    }
}