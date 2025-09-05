import { Module } from '@nestjs/common';

import { ConsultantReportsController } from './consultant-reports.controller';
import { ConsultantReportsService } from './consultant-reports.service';
import { OrderReportsController } from './order-report.controller';
import { OrderReportsService } from './order-report.service';

@Module({
  imports: [],
  controllers: [OrderReportsController, ConsultantReportsController],
  providers: [OrderReportsService, ConsultantReportsService],
  exports: [],
})
export class AdminReportModule { }
