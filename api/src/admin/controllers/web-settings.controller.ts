import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { res } from "src/common/response.helper";
import { WebSettingsService } from "../services/web-settings.service";

@Controller('admin-website/settings')
export class WebSettingsController {
    constructor(private readonly webSettingsService: WebSettingsService) { }

    @Post()
    async addSettings(@Body() settings: any) {
        const response = await this.webSettingsService.addSettings(settings)
        return res.success(response)
    }

}