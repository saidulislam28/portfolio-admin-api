import { Injectable } from "@nestjs/common";
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WebSettingsService {
    constructor(private readonly prismaService: PrismaService) { }

    async addSettings(data: any) {
        const curr_settings = []
        const add_settings = []

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const setting = await this.prismaService.webSetting.findFirst({ where: { key: element?.key } })
            if (setting !== null) {
                curr_settings.push({ ...element, id: setting?.id })
            }
            else {
                add_settings.push(element)
            }
        }
        let update_settings = []
        if (curr_settings?.length) {
            for (let i = 0; i < curr_settings.length; i++) {
                const element = curr_settings[i];
                const setting = await this.prismaService.webSetting.update({
                    where: { id: Number(element?.id) },
                    data:{
                        value:element?.value
                    }
                })
                if (setting !== null) {
                    update_settings.push(setting)
                }
            }
        }

        let new_settings
        if (add_settings?.length) {
            new_settings = await this.prismaService.webSetting.createMany({ data: add_settings })
        }

        return { new_settings, update_settings }
    }
}
