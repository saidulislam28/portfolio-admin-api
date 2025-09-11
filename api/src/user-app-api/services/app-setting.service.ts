/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable import/no-unresolved */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppSettingService {
  constructor(private readonly prismaService: PrismaService) { }

  async getHomeData() {
    console.log('app set sevice called')
    const settings = await this.prismaService.setting.findMany();
    const settingData: any = settings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    const base_data = {
      email: settingData?.email,
      map: settingData?.map,
      phone: settingData?.phone,
      address: settingData?.address,
      logo: settingData?.logo,
      favicon: settingData?.favicon,
      facebook: settingData?.facebook,
      twitter: settingData?.twitter,
      instagram: settingData?.instagram,
      youtube: settingData?.youtube,
      linkedin: settingData?.linkedin,
      brand_name: settingData?.brand_name,
      brand_url: settingData?.brand_url,
      delivery_charge: settingData?.delivery_charge
    };

    const slider_data = await this.prismaService.appSlider.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });
    const video_slider_data = await this.prismaService.videoSlider.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });

    // const ielts_registration = await this.prismaService.ieltsTestRegistration.findFirst({
    //   where: { is_active: true }
    // })
    //   model StudyAbroadRegistration {
    // id        Int      @id @default(autoincrement())
    // is_active Boolean?
    // values    String
    // image     String?
    // image1    String?
    // image2    String?

    // @@map("study_abroad_reg")
    // }
    const ielts_registration = {
      values: settingData.ielts_description,
      image: settingData.ielts_image,
    };
    const online_course = {
      values: settingData.online_course_description,
      image: settingData.online_course_image_1,
      image1: settingData.online_course_image_2,
      image2: settingData.online_course_image_3,
    };
    const study_abroad = {
      values: settingData.study_abroad_description,
      image: settingData.study_abroad_image_1,
      image1: settingData.study_abroad_image_2,
      image2: settingData.study_abroad_image_3,
    };
    // const online_course = await this.prismaService.onlineCourseRegistration.findFirst({
    //   where: { is_active: true }
    // })

    // const packages = await this.prismaService.package.findMany({
    //   where: { is_features: true },
    //   orderBy: { sort_order: 'asc' },
    //   take: 3,
    // });

    return {
      base_data,
      ielts_registration,
      slider_data,
      online_course,
      study_abroad,
      video_slider_data,
    };
  }
}
