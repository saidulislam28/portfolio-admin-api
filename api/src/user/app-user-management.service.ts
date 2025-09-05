/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import EmailService from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserPasswordDto, UpdateUserProfileDto } from './dto/user.profile.dto';

@Injectable()
export class UserDashBoardService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly emailService: EmailService
    ) { }

    async getUser(id: number) {
        const user = await this.prismaService.user.findFirst({
            where: { id },
        });

        if (user === null) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        delete user['password'];
        return user;
    }

    async updateUserProfile(data: UpdateUserProfileDto, id: number) {

        console.log("user update profile data", data)

        const user = await this.prismaService.user.findFirst({ where: { id } });

        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        let payload: any = {};

        if ( data.profile_image && data.profile_image !== null) {
            payload.profile_image = data.profile_image;
        }
        if (data.name) {
            payload.full_name = data.name;
        }
        if (data.email) {
            payload.email = data.email;
        }
        if (data.phone) {
            payload.phone = data.phone;
        }

        const req = await this.prismaService.user.update({
            where: { id: user.id },
            data: payload
        });

        if (req === null) {
            throw new HttpException("User update failed", HttpStatus.NOT_FOUND);
        }

        delete req['password'];
        return req;
    }

    async updateUserPassword(data: UpdateUserPasswordDto, id: number) {
        const user = await this.prismaService.user.findFirst({ where: { id } });

        if (user === null) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        const password_match = await bcrypt.compare(data.current_password, user.password);

        if (!password_match) {
            throw new HttpException("Password did not match", HttpStatus.UNAUTHORIZED);
        }

        const hash = await bcrypt.hash(data.new_password, 10);
        const req = await this.prismaService.user.update({
            where: { id: user.id },
            data: { password: hash }
        });

        if (req === null) {
            throw new HttpException("User update failed", HttpStatus.NOT_FOUND);
        }

        delete req['password'];
        return req;
    }
}