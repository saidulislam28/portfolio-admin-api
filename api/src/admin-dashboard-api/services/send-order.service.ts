import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import EmailService from 'src/email/email.service';
import { sendOrderToVendor } from '../utils/vendor-order-pdf';

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
                OrderItem: {
                    select: {
                        Book: {
                            select: {
                                title: true,
                                price: true,
                                category: true,
                                isbn: true,
                                writer: true
                            }
                        },
                        subtotal: true,
                        qty: true,
                        unit_price: true,
                        order_id: true
                    }
                },
            },
        });
        if (!order) throw new NotFoundException('Order not found');
        const pdfBuffer = await sendOrderToVendor(order);
        const sendEmail = await this.emailService.sendBookvendorOrder(
            vendor.email,
            order.id,
            pdfBuffer
        );

        if (sendEmail.send_message) {
            await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    is_send_to_vendor: true
                }
            })
        }
        return { send_message: 'Order sent to vendor successfully.', sendEmail };

    }
}
