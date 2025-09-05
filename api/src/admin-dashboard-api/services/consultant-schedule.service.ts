// consultant-schedule.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateWorkHourDto,
  UpdateWorkHourDto,
  CreateBulkWorkHoursDto,
  CreateOffDayDto,
  UpdateOffDayDto,
  CreateBulkOffDaysDto,
  GetWorkHoursQueryDto,
  GetOffDaysQueryDto,
  WorkHourResponseDto,
  OffDayResponseDto,
  ConsultantScheduleResponseDto,
} from '../dtos/work-hour.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConsultantScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper method to validate consultant exists
  private async validateConsultantExists(consultantId: number): Promise<void> {
    const consultant = await this.prisma.consultant.findUnique({
      where: { id: consultantId },
    });

    if (!consultant) {
      throw new NotFoundException(`Consultant with ID ${consultantId} not found`);
    }
  }

  // Helper method to validate time format and logic
  private validateTimeRange(startTime: string, endTime: string): void {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      throw new BadRequestException('Start time must be before end time');
    }
  }

  // Helper method to convert time string to minutes
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper method to check for overlapping work hours
  private async checkWorkHourOverlap(
    consultantId: number,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeId?: number,
  ): Promise<void> {
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);

    const existingWorkHours = await this.prisma.consultantWorkHour.findMany({
      where: {
        consultant_id: consultantId,
        day_of_week: dayOfWeek,
        is_active: true,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    for (const workHour of existingWorkHours) {
      const existingStart = this.timeToMinutes(workHour.start_time);
      const existingEnd = this.timeToMinutes(workHour.end_time);

      // Check for overlap
      if (startMinutes < existingEnd && endMinutes > existingStart) {
        throw new ConflictException(
          `Work hour overlaps with existing shift: ${workHour.start_time}-${workHour.end_time}`,
        );
      }
    }
  }

  // Work Hours Methods

  async createWorkHour(createWorkHourDto: CreateWorkHourDto): Promise<WorkHourResponseDto> {
    await this.validateConsultantExists(createWorkHourDto.consultant_id);
    this.validateTimeRange(createWorkHourDto.start_time, createWorkHourDto.end_time);
    
    await this.checkWorkHourOverlap(
      createWorkHourDto.consultant_id,
      createWorkHourDto.day_of_week,
      createWorkHourDto.start_time,
      createWorkHourDto.end_time,
    );

    try {
      const workHour = await this.prisma.consultantWorkHour.create({
        data: createWorkHourDto,
      });

      return workHour;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Work hour with these details already exists');
      }
      throw error;
    }
  }

  async createBulkWorkHours(createBulkWorkHoursDto: CreateBulkWorkHoursDto): Promise<WorkHourResponseDto[]> {
    await this.validateConsultantExists(createBulkWorkHoursDto.consultant_id);

    // Validate all work hours
    for (const workHour of createBulkWorkHoursDto.work_hours) {
      this.validateTimeRange(workHour.start_time, workHour.end_time);
    }

    // Check for internal overlaps within the batch
    const workHoursByDay = createBulkWorkHoursDto.work_hours.reduce((acc, wh) => {
      if (!acc[wh.day_of_week]) acc[wh.day_of_week] = [];
      acc[wh.day_of_week].push(wh);
      return acc;
    }, {} as Record<number, typeof createBulkWorkHoursDto.work_hours>);

    for (const [day, dayWorkHours] of Object.entries(workHoursByDay)) {
      const sortedHours = dayWorkHours.sort((a, b) => 
        this.timeToMinutes(a.start_time) - this.timeToMinutes(b.start_time)
      );

      for (let i = 0; i < sortedHours.length - 1; i++) {
        const current = sortedHours[i];
        const next = sortedHours[i + 1];
        
        if (this.timeToMinutes(current.end_time) > this.timeToMinutes(next.start_time)) {
          throw new ConflictException(
            `Overlapping work hours in day ${day}: ${current.start_time}-${current.end_time} and ${next.start_time}-${next.end_time}`
          );
        }
      }

      // Check against existing work hours
      for (const workHour of dayWorkHours) {
        await this.checkWorkHourOverlap(
          createBulkWorkHoursDto.consultant_id,
          workHour.day_of_week,
          workHour.start_time,
          workHour.end_time,
        );
      }
    }

    const workHoursData = createBulkWorkHoursDto.work_hours.map(wh => ({
      ...wh,
      consultant_id: createBulkWorkHoursDto.consultant_id,
    }));

    try {
      const result = await this.prisma.$transaction(
        workHoursData.map(data => 
          this.prisma.consultantWorkHour.create({ data })
        )
      );

      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('One or more work hours already exist');
      }
      throw error;
    }
  }

  async getWorkHours(
    consultantId: number,
    query: GetWorkHoursQueryDto,
  ): Promise<WorkHourResponseDto[]> {
    await this.validateConsultantExists(consultantId);

    const workHours = await this.prisma.consultantWorkHour.findMany({
      where: {
        consultant_id: consultantId,
        ...(query.day_of_week && { day_of_week: query.day_of_week }),
        ...(query.is_active !== undefined && { is_active: query.is_active }),
      },
      orderBy: [
        { day_of_week: 'asc' },
        { start_time: 'asc' },
      ],
    });

    return workHours;
  }

  async updateWorkHour(
    workHourId: number,
    updateWorkHourDto: UpdateWorkHourDto,
  ): Promise<WorkHourResponseDto> {
    const existingWorkHour = await this.prisma.consultantWorkHour.findUnique({
      where: { id: workHourId },
    });

    if (!existingWorkHour) {
      throw new NotFoundException(`Work hour with ID ${workHourId} not found`);
    }

    // Validate time range if both times are provided or being updated
    const startTime = updateWorkHourDto.start_time ?? existingWorkHour.start_time;
    const endTime = updateWorkHourDto.end_time ?? existingWorkHour.end_time;
    const dayOfWeek = updateWorkHourDto.day_of_week ?? existingWorkHour.day_of_week;

    this.validateTimeRange(startTime, endTime);

    // Check for overlaps if time or day is being changed
    if (
      updateWorkHourDto.start_time ||
      updateWorkHourDto.end_time ||
      updateWorkHourDto.day_of_week
    ) {
      await this.checkWorkHourOverlap(
        existingWorkHour.consultant_id,
        dayOfWeek,
        startTime,
        endTime,
        workHourId,
      );
    }

    try {
      const updatedWorkHour = await this.prisma.consultantWorkHour.update({
        where: { id: workHourId },
        data: updateWorkHourDto,
      });

      return updatedWorkHour;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Work hour with these details already exists');
      }
      throw error;
    }
  }

  async deleteWorkHour(workHourId: number): Promise<void> {
    const existingWorkHour = await this.prisma.consultantWorkHour.findUnique({
      where: { id: workHourId },
    });

    if (!existingWorkHour) {
      throw new NotFoundException(`Work hour with ID ${workHourId} not found`);
    }

    await this.prisma.consultantWorkHour.delete({
      where: { id: workHourId },
    });
  }

  // Off Days Methods

  async createOffDay(createOffDayDto: CreateOffDayDto): Promise<OffDayResponseDto> {
    await this.validateConsultantExists(createOffDayDto.consultant_id);

    try {
      const offDay = await this.prisma.consultantOffDay.create({
        data: {
          ...createOffDayDto,
          off_date: new Date(createOffDayDto.off_date),
        },
      });

      return {
        ...offDay,
        off_date: offDay.off_date.toISOString().split('T')[0],
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Off day already exists for this date');
      }
      throw error;
    }
  }

  async createBulkOffDays(createBulkOffDaysDto: CreateBulkOffDaysDto): Promise<OffDayResponseDto[]> {
    await this.validateConsultantExists(createBulkOffDaysDto.consultant_id);

    const offDaysData = createBulkOffDaysDto.off_dates.map(date => ({
      consultant_id: createBulkOffDaysDto.consultant_id,
      off_date: new Date(date),
      reason: createBulkOffDaysDto.reason,
      is_recurring: createBulkOffDaysDto.is_recurring ?? false,
    }));

    try {
      const result = await this.prisma.$transaction(
        offDaysData.map(data => 
          this.prisma.consultantOffDay.create({ data })
        )
      );

      return result.map(offDay => ({
        ...offDay,
        off_date: offDay.off_date.toISOString().split('T')[0],
      }));
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('One or more off days already exist');
      }
      throw error;
    }
  }

  async getOffDays(
    consultantId: number,
    query: GetOffDaysQueryDto,
  ): Promise<OffDayResponseDto[]> {
    await this.validateConsultantExists(consultantId);

    const whereClause: any = {
      consultant_id: consultantId,
    };

    if (query.start_date || query.end_date) {
      whereClause.off_date = {};
      if (query.start_date) {
        whereClause.off_date.gte = new Date(query.start_date);
      }
      if (query.end_date) {
        whereClause.off_date.lte = new Date(query.end_date);
      }
    }

    if (query.is_recurring !== undefined) {
      whereClause.is_recurring = query.is_recurring;
    }

    const offDays = await this.prisma.consultantOffDay.findMany({
      where: whereClause,
      orderBy: { off_date: 'asc' },
    });

    return offDays.map(offDay => ({
      ...offDay,
      off_date: offDay.off_date.toISOString().split('T')[0],
    }));
  }

  async updateOffDay(
    offDayId: number,
    updateOffDayDto: UpdateOffDayDto,
  ): Promise<OffDayResponseDto> {
    const existingOffDay = await this.prisma.consultantOffDay.findUnique({
      where: { id: offDayId },
    });

    if (!existingOffDay) {
      throw new NotFoundException(`Off day with ID ${offDayId} not found`);
    }

    const updateData: any = { ...updateOffDayDto };
    if (updateOffDayDto.off_date) {
      updateData.off_date = new Date(updateOffDayDto.off_date);
    }

    try {
      const updatedOffDay = await this.prisma.consultantOffDay.update({
        where: { id: offDayId },
        data: updateData,
      });

      return {
        ...updatedOffDay,
        off_date: updatedOffDay.off_date.toISOString().split('T')[0],
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Off day already exists for this date');
      }
      throw error;
    }
  }

  async deleteOffDay(offDayId: number): Promise<void> {
    const existingOffDay = await this.prisma.consultantOffDay.findUnique({
      where: { id: offDayId },
    });

    if (!existingOffDay) {
      throw new NotFoundException(`Off day with ID ${offDayId} not found`);
    }

    await this.prisma.consultantOffDay.delete({
      where: { id: offDayId },
    });
  }

  // Combined Methods

  async getCompleteSchedule(consultantId: number): Promise<ConsultantScheduleResponseDto> {
    await this.validateConsultantExists(consultantId);

    const [workHours, offDays] = await Promise.all([
      this.getWorkHours(consultantId, {}),
      this.getOffDays(consultantId, {}),
    ]);

    return {
      work_hours: workHours,
      off_days: offDays,
    };
  }

  async clearSchedule(consultantId: number): Promise<void> {
    await this.validateConsultantExists(consultantId);

    await this.prisma.$transaction([
      this.prisma.consultantWorkHour.deleteMany({
        where: { consultant_id: consultantId },
      }),
      this.prisma.consultantOffDay.deleteMany({
        where: { consultant_id: consultantId },
      }),
    ]);
  }

  // Utility Methods

  async checkAvailability(consultantId: number, date: string) {
    await this.validateConsultantExists(consultantId);

    const checkDate = new Date(date);
    const dayOfWeek = checkDate.getDay() || 7; // Convert Sunday (0) to 7

    // Get work hours for this day
    const workHours = await this.prisma.consultantWorkHour.findMany({
      where: {
        consultant_id: consultantId,
        day_of_week: dayOfWeek,
        is_active: true,
      },
      orderBy: { start_time: 'asc' },
    });

    // Check if it's an off day
    const offDay = await this.prisma.consultantOffDay.findFirst({
      where: {
        consultant_id: consultantId,
        off_date: checkDate,
      },
    });

    const available = workHours.length > 0 && !offDay;

    return {
      available,
      date,
      day_of_week: dayOfWeek,
      work_hours: workHours,
      is_off_day: !!offDay,
      off_day_reason: offDay?.reason || null,
    };
  }
}