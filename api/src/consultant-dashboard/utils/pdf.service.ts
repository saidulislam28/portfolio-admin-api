import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb } from 'pdf-lib';

@Injectable()
export class PdfService {
  async generateFeedbackPdf(reportData: any): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);


        console.log("hitting pdf service")

    const { width, height } = page.getSize();
    
    // Add title
    page.drawText('Conversation Feedback Report', {
      x: 50,
      y: height - 50,
      size: 20,
      color: rgb(0, 0, 0),
    });

    // Add report details
    let yPosition = height - 100;
    
    // Add overall level
    page.drawText(`Overall Level: ${reportData.overallLevel}`, {
      x: 50,
      y: yPosition,
      size: 14,
    });
    yPosition -= 30;

    // Add general comments
    page.drawText(`General Comments: ${reportData.generalComments}`, {
      x: 50,
      y: yPosition,
      size: 12,
    });
    yPosition -= 50;

    // Add assessment sections
    const sections = [
      { title: 'Fluency', prefix: 'fluency' },
      { title: 'Vocabulary', prefix: 'vocab' },
      { title: 'Grammar', prefix: 'grammar' },
      { title: 'Pronunciation', prefix: 'pron' },
    ];

    for (const section of sections) {
      page.drawText(`${section.title}:`, {
        x: 50,
        y: yPosition,
        size: 14,
        color: rgb(0, 0, 0.5),
      });
      yPosition -= 20;

      // Add section items
      for (const [key, value] of Object.entries(reportData)) {
        if (key.startsWith(section.prefix) && typeof value === 'boolean') {
          const text = key.replace(section.prefix, '').replace(/([A-Z])/g, ' $1').trim();
          page.drawText(`- ${text}: ${value ? '✓' : '✗'}`, {
            x: 60,
            y: yPosition,
            size: 12,
          });
          yPosition -= 20;
        }
      }
      yPosition -= 10;
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}