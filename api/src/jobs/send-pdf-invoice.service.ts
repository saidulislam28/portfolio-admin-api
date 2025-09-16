/* eslint-disable */
import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { QUEUE_JOBS, QUEUE_NAME } from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';

import { InvoicePdfGeneratorService } from './invoice-pdf-generator.service';

interface InvoiceEmailJob {
    orderId: number;
}

@Processor(QUEUE_NAME)
@Injectable()
export class SendPdfInvoiceService {
    private readonly logger = new Logger(SendPdfInvoiceService.name);
    private transporter: nodemailer.Transporter;

    constructor(private readonly prisma: PrismaService,
        private readonly invoicePdfService: InvoicePdfGeneratorService,
    ) {
        // Initialize nodemailer transporter
        this.transporter = nodemailer.createTransport({
            // Configure your email provider here
            pool: true,
            service: 'Gmail',
            port: 587,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD,
            },
        });
    }

    @Process(QUEUE_JOBS.send_payment_invoice)
    async handleInvoiceEmail(job: Job<InvoiceEmailJob>) {
        this.logger.log(`Processing invoice email job: ${job.id}, attempt: ${job.attemptsMade + 1}`);

        try {
            const { orderId } = job.data;

            // Fetch complete order details with all related data
            const order = await this.fetchOrderDetails(orderId);

            if (!order) {
                throw new Error(`Order not found with ID: ${orderId}`);
            }

            // Fetch payment details
            const payment = await this.fetchPaymentDetails(orderId);

            if (!payment) {
                throw new Error(`Payment not found for order ID: ${orderId}`);
            }

            // Get user email from order
            const email = order.email || order.User?.email;

            if (!email) {
                throw new Error(`No email found for order ID: ${orderId}`);
            }

            // Generate PDF invoice
            const pdfBuffer = await this.invoicePdfService.generateInvoicePDF(order, payment);

            // Generate email content
            const emailHtml = this.generateEmailTemplate(order, payment);

            // Generate filename with order ID and timestamp
            const filename = `invoice_${order.id}_${Date.now()}.pdf`;

            // Send email with PDF attachment
            await this.sendEmailWithAttachment(
                email,
                `Invoice #${order.id} - Payment Confirmation`,
                emailHtml,
                pdfBuffer,
                filename
            );

            this.logger.log(`Invoice email sent successfully for order: ${order.id}`);

        } catch (error) {
            this.logger.error(`Failed to process invoice email job: ${error.message}`);
            throw error;
        }
    }

    private async fetchOrderDetails(orderId: number) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    User: {
                        select: {
                            id: true,
                            full_name: true,
                            email: true,
                            phone: true,
                        }
                    },
                    Package: {
                        select: {
                            id: true,
                            name: true,
                            price_bdt: true,
                            price_usd: true,
                            price_bdt_original: true,
                            price_usd_original: true,
                            class_count: true,
                            sessions_count: true,
                            class_duration: true,
                            description: true,
                        }
                    },
                    ExamCenter: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    OrderItem: {
                        include: {
                            Book: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    price: true,
                                    writer: true,
                                    category: true,
                                }
                            }
                        }
                    },
                    OrderCoupon: {
                        include: {
                            coupon: {
                                select: {
                                    id: true,
                                    code: true,
                                    description: true,
                                    discount_type: true,
                                    discount_value: true,
                                }
                            }
                        }
                    }
                }
            });

            return order;
        } catch (error) {
            this.logger.error(`Error fetching order details: ${error.message}`);
            throw error;
        }
    }

    private async fetchPaymentDetails(orderId: number) {
        try {
            const payment = await this.prisma.payment.findFirst({
                where: { order_id: orderId },
                orderBy: { id: 'desc' }, // Get the latest payment
            });

            return payment;
        } catch (error) {
            this.logger.error(`Error fetching payment details: ${error.message}`);
            throw error;
        }
    }

    private generateEmailTemplate(order: any, payment: any): string {
        const customerName = order.first_name
            ? `${order.first_name}`
            : order.User?.full_name || 'Valued Customer';

        const serviceName = this.getServiceDisplayName(order.service_type);

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Payment Confirmation</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { background-color: #34495e; color: white; padding: 15px; text-align: center; font-size: 12px; }
                .status-paid { color: #27ae60; font-weight: bold; }
                .order-details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #3498db; }
                .btn { display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Payment Confirmation</h1>
                    <p>SpeakingMate</p>
                </div>
                
                <div class="content">
                    <h2>Dear ${customerName || 'Valued Customer'},</h2>
                    
                    <p>Thank you for your payment! We have successfully received your payment for the following service:</p>
                    
                    <div class="order-details">
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> #${order.id}</p>
                        <p><strong>Customer Phone:</strong> #${order?.User?.phone}</p>
                        <p><strong>Customer Email:</strong> #${order?.User?.email}</p>
                        <p><strong>Service:</strong> ${serviceName}</p>
                        <p><strong>Amount:</strong> ৳${(payment.amount || order.total || 0).toFixed(2)}</p>
                        <p><strong>Payment Status:</strong> <span class="status-paid">${payment.status}</span></p>
                        <p><strong>Transaction ID:</strong> ${payment.transaction_id || 'N/A'}</p>
                        <p><strong>Payment Date:</strong> ${new Date(payment.paid_at || Date.now()).toLocaleString()}</p>
                    </div>
                    
                    <p>Please find your detailed invoice attached to this email. Keep this invoice for your records.</p>
                    
                    <p>If you have any questions about your order or payment, please don't hesitate to contact our support team.</p>
                    
                    <p>Thank you for choosing our services!</p>
                </div>
                
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} SpeakingMate. All rights reserved.</p>
                    <p>Email: info@speakingmate.com | Phone: +880 123 456 7890</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    private getServiceDisplayName(serviceType: string): string {
        const serviceNames = {
            'book_purchase': 'Book Purchase',
            'ielts_gt': 'IELTS General Training',
            'ielts_academic': 'IELTS Academic',
            'spoken': 'Spoken English',
            'speaking_mock_test': 'IELTS Speaking Mock Test',
            'conversation': 'English Conversation Practice',
            'exam_registration': 'IELTS Exam Registration',
            'study_abroad': 'Study Abroad Consultation'
        };

        return serviceNames[serviceType] || serviceType.replace(/_/g, ' ').toUpperCase();
    }

    private async sendEmailWithAttachment(
        to: string,
        subject: string,
        html: string,
        pdfBuffer: Buffer,
        filename: string
    ): Promise<void> {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@yourcompany.com',
                to,
                subject,
                html,
                attachments: [
                    {
                        filename,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            };

            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to: ${to}`);

        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            throw error;
        }
    }
}