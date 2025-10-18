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

    const skills = await this.prismaService.skills.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });
    const projects = await this.prismaService.projects.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });
    const education = await this.prismaService.education.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });



    return {
      base_data,
      skills,
      education,
      projects,
    };
  }
}
