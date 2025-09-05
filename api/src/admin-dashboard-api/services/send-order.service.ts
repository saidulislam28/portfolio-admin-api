// src/orders/order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import EmailService from 'src/email/email.service';
// import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendOrderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
    ) { }

    async sendOrderToVendor(vendor_id: number, order_id: number) {
        const vendor = await this.prisma.bookVendor.findUnique({ where: { id: vendor_id } });
        if (!vendor || !vendor.email) throw new NotFoundException('Vendor not found or missing email');

        const order = await this.prisma.order.findUnique({
            where: { id: order_id },
            include: {
                OrderItem: true,
                User: true,
            },
        });
        if (!order) throw new NotFoundException('Order not found');
        const sendEamil = await this.emailService.sendEmail(
            vendor.email,
            `You have an new Order`,
            "",
            `<h3>New Book Order Received </h3>
            <p> <strong>Customer: </strong> ${order.first_name} ${order.last_name}</p>
        <p><strong>Email: </strong> ${order.email}</p>
        <p><strong>Phone: </strong> ${order.phone}</p>
        <p><strong>Address: </strong> ${order.delivery_address}</p>
        <p><strong>Order Total: </strong> ${order.total} <span>Taka </span> </p>
        <p><strong>Order Total: </strong> ${order.subtotal} <span>Taka </span> </p>
        <p><strong>Items: </strong></p>
        <ul>
        ${order.OrderItem.map(item => `<li>${JSON.stringify(item)}</li>`).join('')}
        </ul>`
        );



        if (sendEamil.send_message) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    is_send_to_vendor: true
                }
            })
        }

        // console.log("order send to vendor", order)

        return { send_message: 'Order sent to vendor successfully.', sendEamil };

    }
}
