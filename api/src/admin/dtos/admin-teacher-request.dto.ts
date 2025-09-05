import { IsNotEmpty, IsString } from 'class-validator';

export class AdminTeacherRequestDto {
    @IsString()
    @IsNotEmpty()
    first_name

    @IsString()
    @IsNotEmpty()
    last_name


    @IsString()
    @IsNotEmpty()
    email


    @IsString()
    @IsNotEmpty()
    phone

    @IsString()
    @IsNotEmpty()
    token: string

    password: string
    
    work_email: string

    is_accepted: boolean
}
