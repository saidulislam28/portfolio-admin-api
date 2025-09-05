import dotenv from "dotenv";

dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { InvoicePdfGeneratorService } from './invoice-pdf-generator.service';

describe('Invoice Email Integration', () => {
  let pdfService: InvoicePdfGeneratorService;
  let transporter: nodemailer.Transporter;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicePdfGeneratorService],
    }).compile();

    pdfService = module.get<InvoicePdfGeneratorService>(InvoicePdfGeneratorService);

    // Create Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    // Initialize nodemailer transporter
    // transporter = nodemailer.createTransport({
    //     pool: true,
    //     service: 'Gmail',
    //     port: 587,
    //     auth: {
    //         user: process.env.SENDER_EMAIL,
    //         pass: process.env.SENDER_PASSWORD,
    //     },
    // });
  });

  it('should generate a PDF and send an email', async () => {
    const fakeOrder = { id: 123, subtotal: 500, total: 500, Package: { name: 'IELTS Course' } };
    const fakePayment = { status: 'PAID', amount: 500 };

    const pdf = await pdfService.generateInvoicePDF(fakeOrder, fakePayment);

    const info = await transporter.sendMail({
      from: 'no-reply@test.com',
      to: 'rashidul69@gmail.com',
      subject: 'Test Invoice',
      text: 'Here is your invoice',
      attachments: [{ filename: 'invoice.pdf', content: pdf }],
    });

    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    expect(info.messageId).toBeDefined();
  });

  afterAll(async () => {
    await transporter.close();
});
});
