
import { USER_ROLE } from '@prisma/client';
import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty, IsOptional, IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { RECIPIENT_TYPE } from 'src/common/constants';

export class SendNotificationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsEnum(RECIPIENT_TYPE)
    recipient_type: "User" | "Consultant";

    @IsOptional()
    @IsArray()
    selected_users?: number[];

    @IsBoolean()
    all_user: boolean;
}
export class SendAllUserDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}

export class SendCallingNotificationDto {
    @IsString()
    @IsNotEmpty()
    event_name: string

    @IsString()
    @IsNotEmpty()
    event_title: string

    @IsNumber()
    @IsNotEmpty()
    receiver_id: number

    @IsString()
    @IsNotEmpty()
    receiver_role: USER_ROLE

    additionalInfo?: any
}