import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SeederService } from '../services/seeder.service';
import { res } from "src/common/response.helper";
import { SettingsService } from "../services/settings.service";

@Controller('admin/settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Post()
    async addSettings(@Body() settings: any) {
        const response = await this.settingsService.addSettings(settings)
        return res.success(response)
    }

}