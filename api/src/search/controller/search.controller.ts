/* eslint-disable max-len */
import { Controller, Get, Query } from '@nestjs/common';
// import { SearchService } from '../services/search.service.ts.old'
// import { CommunitySize } from '@prisma/client';
import { res } from '../../common/response.helper';

@Controller('search')
export class SearchController {
    // constructor(private readonly searchService: SearchService) { }

    // @Get('care-home')//filter by city id, community_size, amenity, care_type, price
    // async getAllCareHomes(
    //     @Query('page') page: number,
    //     @Query('city') city: string,
    //     @Query('community_size') community_size: CommunitySize,
    //     @Query('amenity') amenity: string,
    //     @Query('care_type') care_type: string,
    //     @Query('price') price: number,

    // ) {
    //     const homes = await this.searchService.getAllCareHomes({ page, perPage: 10 }, { city, community_size, amenity, care_type, price })
    //     return res.success(homes)
    // }
}