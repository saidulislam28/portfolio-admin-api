/* eslint-disable */
import path from "path";

const PDFDocument = require('pdfkit');
const fs = require('fs');

export function sendOrderToVendor(order): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            margin: 40,
            size: 'A4',
            bufferPages: true,
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Colors
        const primaryColor = '#f25a29';
        const darkGray = '#333333';
        const lightGray = '#666666';
        const borderGray = '#dddddd';

        // Page setup
        const pageWidth = doc.page.width;
        const margin = 40;
        const contentWidth = pageWidth - margin * 2;
        let currentY = 0;
        const logoPath = path.join(process.cwd(), "public", "uploads", "Logo512.png");

        console.log("logo path", logoPath);

        // ---------------- HEADER ----------------
        doc.rect(0, 0, pageWidth, 100).fill(primaryColor);

        // Logo placeholder (local image)
        doc.image(logoPath, margin, 20, { width: 60, height: 60 });

        doc.fillColor('white').font('Helvetica-Bold').fontSize(16).text('SpeakingMate', margin + 70, 30);
        doc.font('Helvetica').fontSize(9).text('MASTER IELTS SPEAKING WITH CONFIDENCE', margin + 70, 50);

        doc.fontSize(9).text('+88 09678 771912', pageWidth - margin - 120, 30);
        doc.text('Info.speakingmate@gmail.co', pageWidth - margin - 120, 45);

        // ---------------- TITLE ----------------
        currentY = 120;
        doc.fillColor(primaryColor).fontSize(20).font('Helvetica-Bold').text('Book Order Details', margin, currentY, { align: 'center', width: contentWidth });
        
        currentY += 40;

        // ---------------- ORDER SUMMARY SECTION ----------------
        const sectionWidth = contentWidth / 2 - 10;
        
        // Left Column - Order Information
        doc.fillColor(darkGray).fontSize(12).font('Helvetica-Bold').text('ORDER INFORMATION', margin, currentY);
        currentY += 20;
        
        doc.font('Helvetica').fontSize(10);
        doc.text(`Order ID: #${order.id}`, margin, currentY);
        currentY += 15;
        
        const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.text(`Order Date: ${orderDate}`, margin, currentY);
        currentY += 15;
        
        const deliveryDate = new Date(order.created_at);
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.text(`Estimated Delivery: ${formattedDeliveryDate}`, margin, currentY);
        currentY += 15;
        
        doc.text(`Payment Status: ${order.payment_status.toUpperCase()}`, margin, currentY);
        currentY += 15;
        
        doc.text(`Order Status: ${order.status}`, margin, currentY);
        currentY += 25;

        // Right Column - Customer Information
        const rightColumnX = margin + sectionWidth + 20;
        let rightColumnY = 160;
        
        doc.font('Helvetica-Bold').fontSize(12).text('CUSTOMER INFORMATION', rightColumnX, rightColumnY);
        rightColumnY += 20;
        
        doc.font('Helvetica').fontSize(10);
        const fullName = order.first_name + (order.last_name ? ' ' + order.last_name : '');
        doc.text(`Name: ${fullName}`, rightColumnX, rightColumnY);
        rightColumnY += 15;
        
        doc.text(`Email: ${order.email}`, rightColumnX, rightColumnY);
        rightColumnY += 15;
        
        doc.text(`Phone: ${order.phone}`, rightColumnX, rightColumnY);
        rightColumnY += 15;
        
        doc.text(`Address: ${order.address}`, rightColumnX, rightColumnY);
        rightColumnY += 25;

        // Use the higher Y position for continuing content
        currentY = Math.max(currentY, rightColumnY);

        // ---------------- ORDER ITEMS TABLE ----------------
        doc.fillColor(darkGray).fontSize(12).font('Helvetica-Bold').text('ORDER ITEMS', margin, currentY);
        currentY += 20;

        // Table Headers
        const tableTop = currentY;
        const colWidths = [contentWidth * 0.4, contentWidth * 0.2, contentWidth * 0.2, contentWidth * 0.2];
        
        doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold');
        doc.text('PRODUCT', margin, tableTop);
        doc.text('PRICE', margin + colWidths[0], tableTop, { width: colWidths[1], align: 'right' });
        doc.text('QTY', margin + colWidths[0] + colWidths[1], tableTop, { width: colWidths[2], align: 'center' });
        doc.text('SUBTOTAL', margin + colWidths[0] + colWidths[1] + colWidths[2], tableTop, { width: colWidths[3], align: 'right' });

        currentY += 15;
        
        // Draw header underline
        doc.moveTo(margin, currentY).lineTo(margin + contentWidth, currentY).strokeColor(borderGray).stroke();
        currentY += 10;

        // Order Items
        doc.fillColor(darkGray).fontSize(10).font('Helvetica');
        
        order.OrderItem.forEach((item, index) => {
            const book = item.Book;
            const rowY = currentY;
            
            // Product name and details
            doc.text(book.title, margin, rowY, { width: colWidths[0] - 10 });
            
            if (book.writer) {
                doc.fontSize(8).fillColor(lightGray).text(`By ${book.writer}`, margin, rowY + 12, { width: colWidths[0] - 10 });
                doc.fontSize(10).fillColor(darkGray);
            }
            
            // Price
            doc.text(`BDT ${item.unit_price.toFixed(2)}`, margin + colWidths[0], rowY, { width: colWidths[1], align: 'right' });
            
            // Quantity
            doc.text(item.qty.toString(), margin + colWidths[0] + colWidths[1], rowY, { width: colWidths[2], align: 'center' });
            
            // Subtotal
            doc.text(`BDT ${item.subtotal.toFixed(2)}`, margin + colWidths[0] + colWidths[1] + colWidths[2], rowY, { width: colWidths[3], align: 'right' });
            
            currentY += 30;
            
            // Draw row separator
            if (index < order.OrderItem.length - 1) {
                doc.moveTo(margin, currentY - 5).lineTo(margin + contentWidth, currentY - 5).strokeColor(borderGray).stroke();
                currentY += 5;
            }
        });

        // ---------------- ORDER TOTALS ----------------
        const totalsTop = currentY + 10;
        
        // Draw totals section background
        doc.rect(margin + contentWidth * 0.5, totalsTop, contentWidth * 0.5, 80).fillColor('#f9f9f9').fill();
        
        // Totals content
        doc.fillColor(darkGray).fontSize(10);
        
        // Subtotal
        doc.text('Subtotal:', margin + contentWidth * 0.5 + 20, totalsTop + 15, { width: contentWidth * 0.3, align: 'right' });
        doc.text(`BDT ${order.subtotal.toFixed(2)}`, margin + contentWidth * 0.5 + contentWidth * 0.3 + 20, totalsTop + 15, { width: contentWidth * 0.2 - 20, align: 'right' });
        
        // Delivery Charge
        doc.text('Delivery Charge:', margin + contentWidth * 0.5 + 20, totalsTop + 30, { width: contentWidth * 0.3, align: 'right' });
        doc.text(`BDT ${order.delivery_charge.toFixed(2)}`, margin + contentWidth * 0.5 + contentWidth * 0.3 + 20, totalsTop + 30, { width: contentWidth * 0.2 - 20, align: 'right' });
        
        // Total
        doc.moveTo(margin + contentWidth * 0.5 + 20, totalsTop + 45).lineTo(margin + contentWidth - 20, totalsTop + 45).strokeColor(borderGray).stroke();
        
        doc.font('Helvetica-Bold').fontSize(12);
        doc.text('Total:', margin + contentWidth * 0.5 + 20, totalsTop + 55, { width: contentWidth * 0.3, align: 'right' });
        doc.text(`BDT ${order.total.toFixed(2)}`, margin + contentWidth * 0.5 + contentWidth * 0.3 + 20, totalsTop + 55, { width: contentWidth * 0.2 - 20, align: 'right' });

        // ---------------- FOOTER ----------------
        const footerY = doc.page.height - 100;
        
        // Thank you message
        doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Thank you for your business!', margin, footerY - 30, { align: 'center', width: contentWidth });
        doc.fillColor(lightGray).fontSize(9).font('Helvetica').text('If you have any questions about this order, please contact our customer support.', margin, footerY - 15, { align: 'center', width: contentWidth });

        doc.fontSize(9).fillColor(darkGray).text('Director-Speaking Test', pageWidth - margin - 150, footerY + 10, { width: 150, align: 'right' });
        doc.font('Helvetica-Bold').text('SpeakingMate.org', pageWidth - margin - 150, footerY + 25, { width: 150, align: 'right' });

        doc.end();
    });
}