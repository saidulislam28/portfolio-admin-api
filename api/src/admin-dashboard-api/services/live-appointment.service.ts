import { Injectable } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LiveAppointmentService {
    constructor(private readonly prisma: PrismaService) { }

    async getLiveAppointments() {
        const nowUtc = new Date();

        const todayDate = new Date(nowUtc.toISOString().slice(0, 10)); // today at 00:00:00 UTC
        const tomorrowDate = new Date(todayDate);
        tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1); // tomorrow at 00:00:00 UTC
        const now = new Date();

        // Get live appointments
        const liveAppointments = await this.prisma.appointment.findMany({
            where: {
                OR: [
                    {
                        start_at: {
                            lte: now,
                        },
                        end_at: {
                            gte: now,
                        },
                    },
                    {
                        User: {
                            is: {
                                is_test_user: true
                            }
                        },
                        Consultant: {
                            is: {
                                is_test_user: true,
                            },
                        }
                    }
                ],
                NOT: {
                    status: AppointmentStatus.COMPLETED,
                    consultant_id: null
                }
            },
            orderBy: [
                {
                    User: {
                        is_test_user: "desc",
                    },
                },
                {
                    Consultant: {
                        is_test_user: "desc",
                    },
                },
                {
                    start_at: "asc",
                },
            ],
            include: {
                User: { select: { full_name: true, id: true, role: true, profile_image: true, is_test_user: true } },
                Consultant: {
                    select: {
                        full_name: true,
                        id: true,
                        is_conversation: true,
                        is_mocktest: true,
                        profile_image: true,
                        is_test_user: true
                    },
                },
                VideoCall: true,
                Order: { select: { service_type: true } },
            },
        });

        // Get today's confirmed appointment count
        const todayAppointmentsCount = await this.prisma.appointment.count({
            where: {
                start_at: {
                    gte: todayDate,
                    lt: tomorrowDate,
                },
                status: 'CONFIRMED',
            },
        });

        return {
            liveAppointments,
            todayAppointmentsCount,
        };
    }

}
