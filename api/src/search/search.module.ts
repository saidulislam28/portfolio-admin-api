/* eslint-disable */
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchController } from './controller/search.controller';
// import { SearchService } from './services/search.service.ts.old';

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [
        SearchController

    ],
    providers: [
        // SearchService
    ],
})
export class SearchModule { }
