/* eslint-disable  */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppSettingService {
  constructor(private readonly prismaService: PrismaService) { }

  async getHomeData() {
    const settings = await this.prismaService.setting.findMany();
    const settingData: any = settings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    const base_data = {
      email: settingData?.email,
      phone: settingData?.phone,
      address: settingData?.address,
      logo: settingData?.logo,
      favicon: settingData?.favicon,
      messenger: settingData?.messenger,
      twitter: settingData?.twitter,
      instagram: settingData?.instagram,
      github: settingData?.github,
      linkedin: settingData?.linkedin,
      resume: settingData?.linkedin,
      cv: settingData?.cv,
      brand_name: settingData?.brand_name,
      brand_url: settingData?.brand_url,
      name: settingData?.name,
      hero_title: settingData?.hero_title,
      hero_desc: settingData?.hero_desc,
      hero_image: settingData?.hero_image,
      web_name: settingData?.web_name,
    };

    const slider_data = await this.prismaService.appSlider.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });
    const video_slider_data = await this.prismaService.videoSlider.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });



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
