import { IsNotEmpty, IsString } from 'class-validator';

export class AdminTeacherRegisterDto {
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
    password: string
    
    
    work_email: string
}
