// import { Process, Processor } from '@nestjs/bull';
// import { Job } from 'bull';
// import { PdfService } from './pdf.service';
// import EmailService from 'src/email/email.service';

// @Processor('report-queue')
// export class ReportProcessor {
//     constructor(
//         private readonly pdfService: PdfService,
//         private readonly emailService: EmailService,
//     ) { }

//     @Process('generate-report')
//     async handleReportGeneration(job: Job<{ reportData: any; email: string }>) {
//         const { reportData, email } = job.data;

//         try {
//             const pdfBuffer = await this.pdfService.generateFeedbackPdf(job.data.reportData);
//             console.log("PDF generated, sending to:", job.data.email);
//             await this.emailService.sendEmailWithPdf(
//                 job.data.email,
//                 'Your Conversation Feedback Report',
//                 'Please find attached your conversation feedback report.',
//                 pdfBuffer
//             );
//             console.log("Email sent successfully");
//         } catch (e) {
//             console.error("Error processing job:", e);
//             throw e; // This will make the job fail and retry if configured
//         }
//     }
// }

