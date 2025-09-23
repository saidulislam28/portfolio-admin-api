import { Module } from "@nestjs/common";
import { WebDataSettingService } from "./service/web-data.service";
import { WebDataSettingsController } from "./controller/web-data.controller";
import { HelpReqController } from "./controller/help.controller";
import { HelpReqService } from "./service/help.service";

@Module({
    controllers: [WebDataSettingsController, HelpReqController],
    providers: [WebDataSettingService, HelpReqService],
    exports: []
})
export class WebsiteModule { }