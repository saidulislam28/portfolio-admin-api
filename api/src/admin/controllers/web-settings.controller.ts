/* eslint-disable  */
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { res } from "src/common/response.helper";
import { WebSettingsService } from "../services/web-settings.service";


import { HasRoles } from "src/user-auth/jwt/has-roles.decorator";
import { Role } from "src/user-auth/dto/role.enum";
import { JwtAuthGuard } from "src/user-auth/jwt/jwt-auth.guard";
import { RolesGuard } from "src/user-auth/jwt/roles.guard";

@HasRoles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin-website/settings')
export class WebSettingsController {
    constructor(private readonly webSettingsService: WebSettingsService) { }

    @Post()
    async addSettings(@Body() settings: any) {
        const response = await this.webSettingsService.addSettings(settings)
        return res.success(response)
    }

}