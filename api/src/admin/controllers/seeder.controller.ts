import { Controller, Get, Query } from "@nestjs/common";
import { SeederService } from '../services/seeder.service';
import { res } from "src/common/response.helper";

@Controller('seeder')
export class SeederController {
    constructor(private readonly seederService: SeederService) { }

    @Get()
    async seederExecute(@Query('model') model: string) {
        const response = await this.seederService.seederExecute(model)
        return res.success(response,`${model} Created Successfully`)
    }
}