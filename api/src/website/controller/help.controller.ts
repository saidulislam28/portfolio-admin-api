import { Controller, Get, Post, Body } from '@nestjs/common';
import { res } from 'src/common/response.helper';
import { HelpReqService } from '../service/help.service';



@Controller('web-help-request')
export class HelpReqController {
    constructor(private readonly helpReqService: HelpReqService) { }

    @Post()
    async create(
        @Body() createSubmissionDto,
    ) {
        const response = await this.helpReqService.createService(createSubmissionDto);
        return res.success(response);
    }
}