import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

@Injectable()
export class InvoicePdfGeneratorService {
  private readonly logger = new Logger(InvoicePdfGeneratorService.name);

  async generateInvoicePDF(order: any, payment: any): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50, size: 'A4' });
                const buffers: Buffer[] = [];

                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });

                // Header
                this.addHeader(doc);
                
                // Invoice details
                this.addInvoiceDetails(doc, order, payment);
                
                // Customer details
                this.addCustomerDetails(doc, order);
                
                // Line items based on service type
                const lineItems = this.getLineItems(order);
                this.addLineItems(doc, lineItems);
                
                // Totals
                this.addTotals(doc, order, payment);
                
                // Footer
                this.addFooter(doc);

                doc.end();

            } catch (error) {
                reject(error);
            }
        });
    }

    private addHeader(doc: PDFKit.PDFDocument): void {
        // Company logo placeholder (you can add actual logo here)
        doc.fontSize(20)
           .fillColor('#2c3e50')
           .text('SPEAKINGMATE', 50, 50)
           .fontSize(12)
           .fillColor('#7f8c8d')
           .text('Professional IELTS Training & Consultation', 50, 75)
           .text('Email: info@ieltscentre.com', 50, 90)
           .text('Phone: +880 123 456 7890', 50, 105);

        // Invoice title
        doc.fontSize(24)
           .fillColor('#e74c3c')
           .text('INVOICE', 400, 50, { align: 'right' });

        // Line separator
        doc.moveTo(50, 130)
           .lineTo(550, 130)
           .strokeColor('#bdc3c7')
           .stroke();
    }

    private addInvoiceDetails(doc: PDFKit.PDFDocument, order: any, payment: any): void {
        const currentY = 150;
        
        doc.fontSize(10)
           .fillColor('#2c3e50')
           .text('Invoice Number:', 400, currentY)
           .text(`#INV-${order.id}`, 480, currentY)
           .text('Order ID:', 400, currentY + 15)
           .text(`#${order.id}`, 480, currentY + 15)
           .text('Invoice Date:', 400, currentY + 30)
           .text(new Date().toLocaleDateString(), 480, currentY + 30)
           .text('Payment Status:', 400, currentY + 45)
           .fillColor('#27ae60')
        //    .fillColor(payment.status === 'PAID' ? '#27ae60' : '#e74c3c')
           .text('PAID', 480, currentY + 45);
        //    .text(payment.status, 480, currentY + 45);
    }

    private addCustomerDetails(doc: PDFKit.PDFDocument, order: any): void {
        const currentY = 150;
        
        doc.fontSize(12)
           .fillColor('#2c3e50')
           .text('Bill To:', 50, currentY);

        const customerName = order.first_name && order.last_name 
            ? `${order.first_name} ${order.last_name}` 
            : order.User?.full_name || 'Customer';

        const customerEmail = order.email || order.User?.email || '';
        const customerPhone = order.phone || order.User?.phone || '';

        doc.fontSize(10)
           .text(customerName, 50, currentY + 20)
           .text(customerEmail, 50, currentY + 35)
           .text(customerPhone, 50, currentY + 50);

        if (order.address || order.delivery_address) {
            doc.text(order.address || order.delivery_address, 50, currentY + 65);
        }
    }

    private getLineItems(order: any): InvoiceLineItem[] {
        const items: InvoiceLineItem[] = [];

        switch (order.service_type) {
            case 'book_purchase':
                // Handle book purchase orders
                if (order.OrderItem && order.OrderItem.length > 0) {
                    order.OrderItem.forEach((item: any) => {
                        items.push({
                            description: item.Book?.title || 'Book Item',
                            quantity: item.qty || 1,
                            unitPrice: item.unit_price || 0,
                            total: item.subtotal || 0
                        });
                    });
                } else {
                    // Fallback if no OrderItems but still a book purchase
                    items.push({
                        description: 'Book Purchase',
                        quantity: 1,
                        unitPrice: order.subtotal || 0,
                        total: order.subtotal || 0
                    });
                }
                break;

            case 'ielts_gt':
            case 'ielts_academic':
                const courseType = order.service_type === 'ielts_gt' ? 'IELTS General Training Course' : 'IELTS Academic Course';
                let courseDescription = courseType;
                
                if (order.Package) {
                    if (order.Package.name) {
                        courseDescription = order.Package.name;
                    }
                    if (order.Package.class_count) {
                        courseDescription += ` (${order.Package.class_count} classes)`;
                    }
                    if (order.Package.class_duration) {
                        courseDescription += ` - ${order.Package.class_duration} min per class`;
                    }
                }

                items.push({
                    description: courseDescription,
                    quantity: 1,
                    unitPrice: order.Package?.price_bdt || order.subtotal || 0,
                    total: order.subtotal || 0
                });
                break;

            case 'speaking_mock_test':
                let mockTestDescription = 'IELTS Speaking Mock Test';
                
                if (order.Package) {
                    if (order.Package.name) {
                        mockTestDescription = order.Package.name;
                    }
                    if (order.Package.sessions_count) {
                        mockTestDescription += ` (${order.Package.sessions_count} sessions)`;
                    }
                    if (order.Package.class_duration) {
                        mockTestDescription += ` - ${order.Package.class_duration} min per session`;
                    }
                }

                items.push({
                    description: mockTestDescription,
                    quantity: order.Package?.sessions_count || 1,
                    unitPrice: order.Package?.price_bdt ? (order.Package.price_bdt / (order.Package.sessions_count || 1)) : (order.subtotal || 0),
                    total: order.subtotal || 0
                });
                break;

            case 'conversation':
                let conversationDescription = 'English Conversation Practice';
                
                if (order.Package) {
                    if (order.Package.name) {
                        conversationDescription = order.Package.name;
                    }
                    if (order.Package.sessions_count) {
                        conversationDescription += ` (${order.Package.sessions_count} sessions)`;
                    }
                    if (order.Package.class_duration) {
                        conversationDescription += ` - ${order.Package.class_duration} min per session`;
                    }
                }

                items.push({
                    description: conversationDescription,
                    quantity: order.Package?.sessions_count || 1,
                    unitPrice: order.Package?.price_bdt ? (order.Package.price_bdt / (order.Package.sessions_count || 1)) : (order.subtotal || 0),
                    total: order.subtotal || 0
                });
                break;

            case 'exam_registration':
                const examCenterName = order.ExamCenter?.name || 'Exam Center';
                items.push({
                    description: `IELTS Exam Registration - ${examCenterName}`,
                    quantity: 1,
                    unitPrice: order.subtotal || 0,
                    total: order.subtotal || 0
                });
                break;

            case 'study_abroad':
                items.push({
                    description: order.Package?.name || 'Study Abroad Consultation',
                    quantity: 1,
                    unitPrice: order.subtotal || 0,
                    total: order.subtotal || 0
                });
                break;

            case 'spoken':
                items.push({
                    description: order.Package?.name || 'Spoken English Course',
                    quantity: 1,
                    unitPrice: order.Package?.price_bdt || order.subtotal || 0,
                    total: order.subtotal || 0
                });
                break;

            default:
                // Generic service
                items.push({
                    description: order.Package?.name || 'Service',
                    quantity: 1,
                    unitPrice: order.subtotal || 0,
                    total: order.subtotal || 0
                });
        }

        return items;
    }

    private addLineItems(doc: PDFKit.PDFDocument, items: InvoiceLineItem[]): void {
        const tableTop = 250;
        const itemCodeX = 50;
        const descriptionX = 120;
        const quantityX = 300;
        const priceX = 350;
        const totalX = 450;

        // Table headers
        doc.fontSize(10)
           .fillColor('#34495e')
           .text('Item', itemCodeX, tableTop)
           .text('Description', descriptionX, tableTop)
           .text('Qty', quantityX, tableTop)
           .text('Unit Price', priceX, tableTop)
           .text('Total', totalX, tableTop);

        // Header underline
        doc.moveTo(itemCodeX, tableTop + 15)
           .lineTo(totalX + 50, tableTop + 15)
           .strokeColor('#bdc3c7')
           .stroke();

        let currentY = tableTop + 25;

        // Line items
        items.forEach((item, index) => {
            const position = currentY + (index * 25);
            
            doc.fontSize(9)
               .fillColor('#2c3e50')
               .text(`${index + 1}`, itemCodeX, position)
               .text(item.description, descriptionX, position, { width: 150 })
               .text(item.quantity.toString(), quantityX, position)
               .text(`BDT ${item.unitPrice.toFixed(2)}`, priceX, position)
               .text(`BDT ${item.total.toFixed(2)}`, totalX, position);
        });

        // Items separator line
        const lineY = currentY + (items.length * 25) + 10;
        doc.moveTo(itemCodeX, lineY)
           .lineTo(totalX + 50, lineY)
           .strokeColor('#bdc3c7')
           .stroke();
    }

    private addTotals(doc: PDFKit.PDFDocument, order: any, payment: any): void {
        const currentY = 400;
        
        doc.fontSize(10)
           .fillColor('#2c3e50');

        // Subtotal
        doc.text('Subtotal:', 400, currentY)
           .text(`BDT ${(order.subtotal || 0).toFixed(2)}`, 480, currentY);

        // Delivery charge (if applicable)
        if (order.delivery_charge && order.delivery_charge > 0) {
            doc.text('Delivery Charge:', 400, currentY + 15)
               .text(`৳${order.delivery_charge.toFixed(2)}`, 480, currentY + 15);
        }

        // Discount (if applicable from coupon)
        if (order.OrderCoupon && order.OrderCoupon.length > 0) {
            const totalDiscount = order.OrderCoupon.reduce((sum: number, coupon: any) => 
                sum + (coupon.discount_amount || 0), 0);
            if (totalDiscount > 0) {
                doc.fillColor('#e74c3c')
                   .text('Discount:', 400, currentY + 30)
                   .text(`-BDT ${totalDiscount.toFixed(2)}`, 480, currentY + 30);
            }
        }

        // Total line
        const totalY = currentY + 45;
        doc.moveTo(400, totalY)
           .lineTo(550, totalY)
           .strokeColor('#2c3e50')
           .stroke();

        // Total amount
        doc.fontSize(12)
           .fillColor('#2c3e50')
           .text('Total Amount:', 400, totalY + 10)
           .text(`BDT ${(order.total || payment.amount || 0).toFixed(2)}`, 480, totalY + 10);

        // Payment method
        if (payment.payment_method) {
            doc.fontSize(9)
               .fillColor('#7f8c8d')
               .text(`Payment Method: ${payment.payment_method}`, 400, totalY + 30);
        }

        if (payment.transaction_id) {
            doc.text(`Transaction ID: ${payment.transaction_id}`, 400, totalY + 45);
        }
    }

    private addFooter(doc: PDFKit.PDFDocument): void {
        const footerY = 700;
        
        // Footer separator
        doc.moveTo(50, footerY - 20)
           .lineTo(550, footerY - 20)
           .strokeColor('#bdc3c7')
           .stroke();

        doc.fontSize(8)
           .fillColor('#95a5a6')
           .text('Thank you for choosing our services!', 50, footerY)
           .text('For any queries, please contact us at info@ieltscentre.com', 50, footerY + 12)
           .text('This is a computer-generated invoice and does not require a signature.', 50, footerY + 24)
           .text(`Generated on: ${new Date().toLocaleString()}`, 50, footerY + 36);

        // Page number
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8)
               .fillColor('#95a5a6')
               .text(`Page ${i + 1} of ${pages.count}`, 450, 750);
        }
    }
}
