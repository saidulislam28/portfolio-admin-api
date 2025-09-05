
import { Controller, Get } from "@nestjs/common";
import { AppSettingService } from "../services/app-setting.service";
import { res } from "src/common/response.helper";


@Controller('app-setting')
export class AppSettingsController {
    constructor(
        private readonly appSettingService: AppSettingService
    ) { }

    @Get('app-data')
    async getHomeData() {
        const response = await this.appSettingService.getHomeData();
        return res.success(response);
    }
}  