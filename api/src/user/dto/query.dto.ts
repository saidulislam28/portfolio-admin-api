import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty,IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class QueryDto {
    @IsNumber()
    @IsPositive()
    @IsOptional()
    skip?: number;
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit?: number;
    @IsOptional()
    @IsString()
    search?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
    @IsBoolean()
    @IsOptional()
    is_verified?: boolean;
}


export class ForgetPasswordDTO {
    @ApiProperty({ description: 'Email or phone number associated with the account' })
    @IsNotEmpty()
    email_or_phone: string;
}

export class OtpVerificationDto {
    @ApiProperty({ description: 'User email address' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'OTP code (6 digits)' })
    @IsNotEmpty()
    otp: number;
}
