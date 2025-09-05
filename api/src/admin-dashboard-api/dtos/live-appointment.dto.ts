import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus, ServiceType, USER_ROLE } from '@prisma/client';

export class UserDto {
    @ApiProperty({ description: 'User ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'User full name', example: 'John Doe' })
    full_name: string;

    @ApiProperty({ 
        description: 'User role', 
        enum: USER_ROLE,
        example: USER_ROLE.USER 
    })
    role: USER_ROLE;

    @ApiPropertyOptional({ 
        description: 'User profile image URL',
        example: 'https://example.com/profile.jpg' 
    })
    profile_image?: string;

    @ApiProperty({ 
        description: 'Whether user is a test user', 
        example: false 
    })
    is_test_user: boolean;
}

export class ConsultantDto {
    @ApiProperty({ description: 'Consultant ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Consultant full name', example: 'Jane Smith' })
    full_name: string;

    @ApiProperty({ 
        description: 'Whether consultant handles conversations', 
        example: true 
    })
    is_conversation: boolean;

    @ApiProperty({ 
        description: 'Whether consultant handles mock tests', 
        example: true 
    })
    is_mocktest: boolean;

    @ApiPropertyOptional({ 
        description: 'Consultant profile image URL',
        example: 'https://example.com/consultant.jpg' 
    })
    profile_image?: string;

    @ApiProperty({ 
        description: 'Whether consultant is a test user', 
        example: false 
    })
    is_test_user: boolean;
}

export class VideoCallDto {
    @ApiProperty({ description: 'Video call ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Appointment ID', example: 1 })
    appointment_id: number;

    @ApiProperty({ description: 'Room ID/Session ID', example: 'room-12345' })
    room_id: string;

    @ApiProperty({ description: 'Video call start time' })
    started_at: Date;

    @ApiPropertyOptional({ description: 'Video call end time' })
    ended_at?: Date;

    @ApiProperty({ description: 'Video call duration in minutes', example: 30 })
    duration: number;

    @ApiProperty({ description: 'Video call status', example: 'active' })
    status: string;
}

export class OrderDto {
    @ApiProperty({ 
        description: 'Service type', 
        enum: ServiceType,
        example: ServiceType.speaking_mock_test 
    })
    service_type: ServiceType;
}

export class AppointmentResponseDto {
    @ApiProperty({ description: 'Appointment ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Appointment start time (UTC)' })
    start_at: Date;

    @ApiProperty({ description: 'Appointment end time (UTC)' })
    end_at: Date;

    @ApiProperty({ 
        description: 'Appointment status', 
        enum: AppointmentStatus,
        example: AppointmentStatus.CONFIRMED 
    })
    status: AppointmentStatus;

    @ApiProperty({ description: 'Appointment duration in minutes', example: 60 })
    duration_in_min: number;

    @ApiPropertyOptional({ description: 'Appointment notes' })
    notes?: string;

    @ApiProperty({ description: 'Appointment token', example: 'uuid-token-12345' })
    token: string;

    @ApiProperty({ description: 'Booking timestamp' })
    booked_at: Date;

    @ApiProperty({ description: 'Consultant ID', example: 1 })
    consultant_id: number;

    @ApiProperty({ description: 'User ID', example: 1 })
    user_id: number;

    @ApiProperty({ description: 'Order ID', example: 1 })
    order_id: number;

    @ApiProperty({ description: 'Slot date' })
    slot_date: Date;

    @ApiProperty({ description: 'Slot time (HH:mm format)', example: '10:30' })
    slot_time: string;

    @ApiPropertyOptional({ description: 'User timezone', example: 'America/New_York' })
    user_timezone?: string;

    @ApiProperty({ description: 'Creation timestamp' })
    created_at: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    updated_at: Date;

    @ApiProperty({ type: UserDto })
    User: UserDto;

    @ApiProperty({ type: ConsultantDto })
    Consultant: ConsultantDto;

    @ApiPropertyOptional({ type: VideoCallDto })
    VideoCall?: VideoCallDto;

    @ApiProperty({ type: OrderDto })
    Order: OrderDto;
}

export class LiveAppointmentsResponseDto {
    @ApiProperty({ 
        type: [AppointmentResponseDto],
        description: 'List of currently active appointments and test user appointments' 
    })
    liveAppointments: AppointmentResponseDto[];

    @ApiProperty({ 
        description: 'Count of confirmed appointments for today', 
        example: 15 
    })
    todayAppointmentsCount: number;
}

// Additional DTOs for future use
export class LiveAppointmentQueryDto {
    @ApiPropertyOptional({
        description: 'Include test user appointments',
        example: true,
        default: true
    })
    include_test_users?: boolean = true;

    @ApiPropertyOptional({
        description: 'Filter by service type',
        enum: ServiceType,
        example: ServiceType.speaking_mock_test
    })
    service_type?: ServiceType;

    @ApiPropertyOptional({
        description: 'Filter by consultant ID',
        example: 1
    })
    consultant_id?: number;
}

export class TodayAppointmentsStatsDto {
    @ApiProperty({ description: 'Total appointments today', example: 20 })
    total: number;

    @ApiProperty({ description: 'Completed appointments today', example: 5 })
    completed: number;

    @ApiProperty({ description: 'Confirmed appointments today', example: 15 })
    confirmed: number;

    @ApiProperty({ description: 'Cancelled appointments today', example: 0 })
    cancelled: number;
}

export class AppointmentStatusCountDto {
    @ApiProperty({ description: 'Appointment status', enum: AppointmentStatus })
    status: AppointmentStatus;

    @ApiProperty({ description: 'Count of appointments with this status', example: 15 })
    count: number;
}