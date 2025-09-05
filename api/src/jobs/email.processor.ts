import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrdersService } from 'src/user-dashboard/services/orders.service';

@Processor('email')
export class EmailProcessor {
    constructor(private readonly ordersService: OrdersService) { }

    @Process('sendInvoice')
    async sendInvoiceEmail(job: Job<{ order: any; payment: any; email: string }>) {
        const { order, payment, email } = job.data;
        await this.ordersService.sendInvoiceEmail(email, order, payment);
    }
}