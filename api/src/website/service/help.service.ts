// src/services/services.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class HelpReqService {
    constructor(private prisma: PrismaService) { }

    async createService(data) {

        console.log("data service req", data);

        const service = await this.prisma.helpRequest.create({
            data: { ...data },
        });

        return service
    }


}