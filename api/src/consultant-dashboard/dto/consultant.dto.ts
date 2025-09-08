
import {
    ApiProperty,
    ApiPropertyOptional
} from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsPositive,
    IsString,
    MaxLength,
    MinLength
} from 'class-validator';

export class QueryDto {
    @ApiPropertyOptional({
        description: 'Number of records to skip for pagination',
        example: 0,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    skip: number;

    @ApiPropertyOptional({
        description: 'Number of records to return for pagination',
        example: 10,
        minimum: 1
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit: number;

    @ApiPropertyOptional({
        description: 'Search term for filtering consultants',
        example: 'john'
    })
    @IsOptional()
    @IsString()
    search: string;

    @ApiPropertyOptional({
        description: 'Filter by active status',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    is_active: boolean;

    @ApiPropertyOptional({
        description: 'Filter by verification status',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    is_verified: boolean;
}

export class OtpVerificationDto {
    @ApiProperty({
        description: 'Email address for OTP verification',
        example: 'consultant@example.com'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: '6-digit OTP code',
        example: 123456
    })
    @IsNumber()
    @IsNotEmpty()
    otp: number;
}

export class ForgetPasswordDTO {
    @ApiProperty({
        description: 'Email address or phone number for password reset',
        example: 'consultant@example.com'
    })
    @IsString()
    @IsNotEmpty()
    email_or_phone: string;
}

export class registrationDTO {
    @ApiProperty({
        description: 'Consultant email address',
        example: 'consultant@example.com'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Consultant full name',
        example: 'John Doe'
    })
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @ApiProperty({
        description: 'Consultant phone number',
        example: '+1234567890'
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'Password (min 6 characters)',
        example: 'password123',
        minLength: 6
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class LoginDto {
    @ApiProperty({
        description: 'Consultant email address',
        example: 'consultant@example.com'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password',
        example: 'password123'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class ResetPasswordDto {
    @ApiProperty({
        description: 'Email address or phone number',
        example: 'consultant@example.com'
    })
    @IsString()
    @IsNotEmpty()
    email_or_phone: string;

    @ApiProperty({
        description: '6-digit OTP code received via email',
        example: 123456
    })
    @IsNumber()
    @IsNotEmpty()
    otp: number;

    @ApiProperty({
        description: 'New password (min 6 characters)',
        example: 'newpassword123',
        minLength: 6
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

// export class UpdateConsultantDto {
//     @ApiPropertyOptional({
//         description: 'Profile image URL',
//         example: 'https://example.com/profile.jpg'
//     })
//     @IsString()
//     @IsOptional()
//     profile_image?: string;

//     @ApiPropertyOptional({
//         description: 'Consultant full name',
//         example: 'John Smith'
//     })
//     @IsString()
//     @IsOptional()
//     name?: string;

//     @ApiPropertyOptional({
//         description: 'Consultant email address',
//         example: 'newemail@example.com'
//     })
//     @IsString()
//     @IsEmail()
//     @IsOptional()
//     email?: string;

//     @ApiPropertyOptional({
//         description: 'Consultant phone number',
//         example: '+1987654321'
//     })
//     @IsString()
//     @IsOptional()
//     phone?: string;
// }



// Query DTOs
export class ConsultantQueryDto {
    @ApiPropertyOptional({
        description: 'Search text for filtering consultants by name, email, or phone',
        example: 'john'
    })
    @IsString()
    @IsOptional()
    searchText?: string;

    @ApiPropertyOptional({
        description: 'Filter by active status',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Filter by verification status',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isVerified?: boolean;

    @ApiPropertyOptional({
        description: 'Start date for filtering by creation date (YYYY-MM-DD)',
        example: '2024-01-01'
    })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({
        description: 'End date for filtering by creation date (YYYY-MM-DD)',
        example: '2024-12-31'
    })
    @IsDateString()
    @IsOptional()
    endDate?: string;
}

export class AppointmentListQueryDto {
    @ApiPropertyOptional({
        description: 'Appointment type filter',
        enum: ['upcoming', 'past', 'live'],
        example: 'upcoming'
    })
    @IsString()
    @IsOptional()
    type?: string;
}

// Request DTOs
export class CreateConsultantDto {
    @ApiProperty({
        description: 'Consultant email address',
        example: 'consultant@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Consultant full name',
        example: 'John Doe'
    })
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @ApiProperty({
        description: 'Consultant phone number',
        example: '+1234567890'
    })
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'Password (min 6 characters)',
        example: 'password123',
        minLength: 6
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({
        description: 'Consultant experience',
        example: '5 years of teaching experience'
    })
    @IsString()
    @IsOptional()
    experience?: string;

    @ApiPropertyOptional({
        description: 'Consultant timezone',
        example: 'UTC'
    })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({
        description: 'Profile image URL',
        example: 'https://example.com/profile.jpg'
    })
    @IsString()
    @IsOptional()
    profile_image?: string;
}

export class UpdateConsultantDto {
    @ApiPropertyOptional({
        description: 'Consultant email address',
        example: 'newemail@example.com'
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        description: 'Consultant full name',
        example: 'John Smith'
    })
    @IsString()
    @IsOptional()
    full_name?: string;

    @ApiPropertyOptional({
        description: 'Consultant phone number',
        example: '+1987654321'
    })
    // @IsPhoneNumber()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({
        description: 'Consultant experience',
        example: '6 years of teaching experience'
    })
    @IsString()
    @IsOptional()
    experience?: string;

    @ApiPropertyOptional({
        description: 'Consultant timezone',
        example: 'America/New_York'
    })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({
        description: 'Profile image URL',
        example: 'https://example.com/new-profile.jpg'
    })
    @IsString()
    @IsOptional()
    profile_image?: string;

    @ApiPropertyOptional({
        description: 'Whether consultant is active',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @ApiPropertyOptional({
        description: 'Whether consultant is verified',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    is_verified?: boolean;
}

export class UpdateAppointmentStatusDto {
    @ApiProperty({
        description: 'Appointment status',
        enum: AppointmentStatus,
        example: AppointmentStatus.CONFIRMED
    })
    @IsEnum(AppointmentStatus)
    @IsNotEmpty()
    status: AppointmentStatus;
}

export class UpdateAppointmentNotesDto {
    @ApiProperty({
        description: 'Appointment notes',
        example: 'Client needs special accommodation',
        maxLength: 500
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    notes: string;
}

// Response DTOs
export class ConsultantResponseDto {
    @ApiProperty({ description: 'Consultant ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Consultant email', example: 'consultant@example.com' })
    email: string;

    @ApiProperty({ description: 'Consultant full name', example: 'John Doe' })
    full_name: string;

    @ApiProperty({ description: 'Consultant phone number', example: '+1234567890' })
    phone: string;

    @ApiProperty({ description: 'Profile image URL', nullable: true })
    profile_image: string | null;

    @ApiProperty({ description: 'Consultant experience', nullable: true })
    experience: string | null;

    @ApiProperty({ description: 'Consultant timezone', nullable: true })
    timezone: string | null;

    @ApiProperty({ description: 'Whether consultant is active', example: true })
    is_active: boolean;

    @ApiProperty({ description: 'Whether consultant is verified', example: true })
    is_verified: boolean;

    @ApiProperty({ description: 'Whether consultant is test user', example: false })
    is_test_user: boolean;

    @ApiProperty({ description: 'Consultant creation date' })
    created_at: Date;

    @ApiProperty({ description: 'Consultant last update date' })
    updated_at: Date;
}

export class ConsultantListResponseDto {
    @ApiProperty({
        type: [ConsultantResponseDto],
        description: 'List of consultants'
    })
    data: ConsultantResponseDto[];

    @ApiProperty({ description: 'Total count of consultants', example: 100 })
    total: number;

    @ApiProperty({ description: 'Current page number', example: 1 })
    page: number;

    @ApiProperty({ description: 'Number of items per page', example: 10 })
    limit: number;

    @ApiProperty({ description: 'Total number of pages', example: 10 })
    totalPages: number;
}

export class AppointmentResponseDto {
    @ApiProperty({ description: 'Appointment ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Appointment start time' })
    start_at: Date;

    @ApiProperty({ description: 'Appointment end time' })
    end_at: Date;

    @ApiProperty({
        description: 'Appointment status',
        enum: AppointmentStatus,
        example: AppointmentStatus.CONFIRMED
    })
    status: AppointmentStatus;

    @ApiProperty({ description: 'Appointment duration in minutes', example: 60 })
    duration_in_min: number;

    @ApiProperty({ description: 'Appointment notes', nullable: true })
    notes: string | null;

    @ApiProperty({ description: 'Appointment token', example: 'uuid-token' })
    token: string;

    @ApiProperty({ description: 'Appointment creation date' })
    created_at: Date;

    @ApiProperty({ description: 'User information' })
    User: {
        id: number;
        full_name: string;
        email: string;
        profile_image: string | null;
    };

    @ApiProperty({ description: 'Order service type' })
    Order: {
        service_type: string;
    };
    @IsOptional()
    MockTestFeedback?: any;

    @IsOptional()
    ConversationFeedback?: any
}

export class AppointmentListResponseDto {
    @ApiProperty({
        type: [AppointmentResponseDto],
        description: 'List of appointments'
    })
    upcoming: AppointmentResponseDto[];

    @ApiProperty({
        type: [AppointmentResponseDto],
        description: 'List of live appointments'
    })
    live: AppointmentResponseDto[];

    @ApiProperty({
        type: [AppointmentResponseDto],
        description: 'List of past appointments'
    })
    past: AppointmentResponseDto[];
}

// Additional DTOs for internal use
export class PaginationDto {
    @ApiProperty({ description: 'Page number', example: 1 })
    @IsNumber()
    @IsPositive()
    page: number;

    @ApiProperty({ description: 'Number of items per page', example: 10 })
    @IsNumber()
    @IsPositive()
    limit: number;
}

export class IdParamDto {
    @ApiProperty({ description: 'Resource ID', example: 1 })
    @IsNumber()
    @IsPositive()
    id: number;
}