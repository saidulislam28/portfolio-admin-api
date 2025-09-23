import { Module } from "@nestjs/common";
import { WebDataSettingService } from "./service/web-data.service";
import { WebDataSettingsController } from "./controller/web-data.controller";

@Module({
    controllers: [WebDataSettingsController],
    providers: [WebDataSettingService],
    exports: []
})
export class WebsiteModule {}