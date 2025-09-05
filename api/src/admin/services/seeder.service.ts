/* eslint-disable max-len */
import { Injectable } from "@nestjs/common";

import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import { packageSeed } from "src/database/seeds/packageSeed";
import { seedConsultants } from "src/database/seeds/consultant";
import { seedUsers } from "src/database/seeds/users";
const prisma = new PrismaClient();

@Injectable()
export class SeederService {
    constructor(private readonly prismaService: PrismaService) { }

    async seederExecute(model: string) {
    
        const hash = bcryptjs.hashSync('123456', 10);
        
          await prisma.adminUser.deleteMany({ where: {} });
          await prisma.adminUser.deleteMany({ where: {} });
          await prisma.adminUser.create({
            data: {
              email: 'admin@email.com',
              first_name: 'Admin',
              last_name: '',
              password: hash,
              role: "SUPER_ADMIN"
            },
          });
          await prisma.package.createMany({
            data: packageSeed,
            skipDuplicates: true,
          });
        
          await seedConsultants();
          await seedUsers();
        if (model === "setting") {
            await this.prismaService.setting.deleteMany({ where: {} });
            return await this.prismaService.setting.createMany({
                data: [
                    {
                        key: 'email',
                        value: 'tuition@provider.com',

                    },
                    {
                        key: 'phone',
                        value: '34523523',
                    },
                    {
                        key: 'desc',
                        value: 'We are an online tuition service that empowers GCSE and A Level students to achieve grades 6-9 at GCSE and B-A* grades at A Level so that they can progress to the colleges, universities, apprenticeships and careers of their dreams.',
                    },
                    {
                        key: 'instagram',
                        value: 'https://instagram.com',
                    },
                    {
                        key: 'facebook',
                        value: 'https://facebook.com',
                    },
                    {
                        key: 'youtube',
                        value: 'https://youtube.com',
                    },
                    {
                        key: 'tiktok',
                        value: 'https://tiktok.com',
                    },
                    {
                        key: 'terms_condition',
                        value: 'value of terms & condition',
                    },
                    {
                        key: 'privacy_policy',
                        value: 'value of privacy policy',
                    },
                    {
                        key: 'vixion',
                        value: 'https://vixion.com',
                    },
                    {
                        key: 'brand_name',
                        value: 'espd',
                    },
                    {
                        key: 'brand_url',
                        value: 'https://espd.school',
                    },
                ],
                skipDuplicates: true,
            });
        }


    }
}


