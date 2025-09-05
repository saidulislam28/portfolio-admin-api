import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AppointmentStatusService {
    constructor(private readonly prismaService: PrismaService) { }

    async cancelAppointment(id, data) {
        return await this.prismaService.appointment.update({ where: { id }, data })
    }

}