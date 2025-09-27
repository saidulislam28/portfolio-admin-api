/* eslint-disable  */
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { SeederService } from '../services/seeder.service';
import { res } from "src/common/response.helper";
import { SettingsService } from "../services/settings.service";
import { HasRoles } from "src/user-auth/jwt/has-roles.decorator";
import { Role } from "src/user-auth/dto/role.enum";
import { JwtAuthGuard } from "src/user-auth/jwt/jwt-auth.guard";
import { RolesGuard } from "src/user-auth/jwt/roles.guard";

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