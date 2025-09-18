// src/ratings/ratings.service.ts
/* eslint-disable */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRatingDto, RatingResponseDto } from '../dtos/appointment-rating.dto';


@Injectable()
export class RatingsService {
    constructor(private prisma: PrismaService) { }

    async createRating(createRatingDto: CreateRatingDto, userId: number) {
        const { appointment_id, rating, comment } = createRatingDto;

        // Check if appointment exists and is completed
        try {
            const appointment = await this.prisma.appointment.findUnique({
                where: { id: Number(appointment_id) },
                include: {
                    User: true,
                    Consultant: true,
                    Rating: true,
                },
            });

            if (!appointment) {
                throw new NotFoundException(`Appointment with ID ${appointment_id} not found`);
            }

            if (appointment.status !== 'COMPLETED') {
                throw new ConflictException('Cannot rate an appointment that is not completed');
            }

            // Check if rating already exists for this appointment
            if (appointment.Rating) {
                throw new ConflictException('This appointment has already been rated');
            }

            // Create the rating
            const newRating = await this.prisma.rating.create({
                data: {
                    rating,
                    comment,
                    User: { connect: { id: Number(userId) } },
                    Consultant: { connect: { id: appointment.consultant_id } },
                    Appointment: { connect: { id: appointment_id } },
                },
                include: {
                    User: true,
                    Consultant: true,
                },
            });

            if (!newRating) {
                throw new Error("Creating Rating is not successfull!!!!")
            }

            await this.prisma.appointment.update({
                where: { id: appointment.id },
                data: {
                    is_rating_given: true,
                }
            })

            return newRating;
        } catch (error) {
            console.log("errorrrr:", error);
        }
    }

    async getRatingsByConsultant(consultantId: number): Promise<RatingResponseDto[]> {
        const ratings = await this.prisma.rating.findMany({
            where: { consultant_id: consultantId },
            include: {
                User: true,
                Consultant: true,
            },
            orderBy: { created_at: 'desc' },
        });

        return ratings.map(this.mapToResponseDto);
    }

    async getRatingByAppointment(appointmentId: number): Promise<RatingResponseDto> {
        const rating = await this.prisma.rating.findUnique({
            where: { appointment_id: appointmentId },
            include: {
                User: true,
                Consultant: true,
            },
        });

        if (!rating) {
            throw new NotFoundException(`Rating for appointment ID ${appointmentId} not found`);
        }

        return this.mapToResponseDto(rating);
    }

    async getConsultantAverageRating(consultantId: number): Promise<{ average: number; count: number }> {
        const ratings = await this.prisma.rating.findMany({
            where: { consultant_id: consultantId },
            select: { rating: true },
        });

        if (ratings.length === 0) {
            return { average: 0, count: 0 };
        }

        const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        const average = sum / ratings.length;

        return { average, count: ratings.length };
    }

    private mapToResponseDto(rating: any): RatingResponseDto {
        return {
            id: rating.id,
            rating: rating.rating,
            comment: rating.comment,
            user_id: rating.user_id,
            consultant_id: rating.consultant_id,
            appointment_id: rating.appointment_id,
            created_at: rating.created_at,
        };
    }
}