/* eslint-disable  */
import { Injectable } from '@nestjs/common';
import { ServiceType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebDataSettingService {
    constructor(private readonly prismaService: PrismaService) { }

    async getHomeData() {
        const settings = await this.prismaService.webSetting.findMany();
        const settingData: any = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        const base_data = {
            email: settingData?.email,
            // map: settingData?.map,
            phone: settingData?.phone,
            // address: settingData?.address,
            logo: settingData?.logo,
            favicon: settingData?.favicon,
            // facebook: settingData?.facebook,
            // twitter: settingData?.twitter,
            // instagram: settingData?.instagram,
            // youtube: settingData?.youtube,
            // linkedin: settingData?.linkedin,
            brand_name: settingData?.brand_name,
            brand_url: settingData?.brand_url,
            delivery_charge: settingData?.delivery_charge,
            play_store: settingData?.play_store,
        };

        const hero_data = {
            hero_image: settingData?.hero_image,
            hero_desc: settingData?.hero_desc,
            hero_title: settingData?.hero_title,
            demo_video: settingData?.demo_video
        };

        const testimonial = await this.prismaService.testimonial.findMany({
            orderBy: { sort_order: 'asc' },
            where: { is_active: true },
            take: 3,
        });
        const faq = await this.prismaService.faq.findMany({
            orderBy: { sort_order: 'asc' },
        });


        const packages = await this.prismaService.package.findMany({
            where: {
                service_type: ServiceType.speaking_mock_test,
                is_active: true,
            },
            orderBy: {
                sort_order: 'asc'
            },
            take: 3
        })


        return {
            base_data,
            hero_data,
            testimonial,
            faq,
            packages
        };
    }
}
