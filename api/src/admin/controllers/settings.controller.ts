/* eslint-disable  */
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { res } from "src/common/response.helper";
import { Role } from "src/user-auth/dto/role.enum";
import { HasRoles } from "src/user-auth/jwt/has-roles.decorator";
import { JwtAuthGuard } from "src/user-auth/jwt/jwt-auth.guard";
import { RolesGuard } from "src/user-auth/jwt/roles.guard";
import { SettingsService } from "../services/settings.service";

@HasRoles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Post()
    async addSettings(@Body() settings: any) {
        const response = await this.settingsService.addSettings(settings)
        return res.success(response)
    }

}