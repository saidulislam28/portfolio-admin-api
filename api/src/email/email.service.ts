// email.service.ts
import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { QUEUE_NAME } from 'src/common/constants';

const SendGrid = require('@sendgrid/mail')

@Injectable()
export default class EmailService {
  private mode: string;
  private nodemailerTransport: Mail;

  constructor(
    @InjectQueue(QUEUE_NAME) private speakingQue: Queue,
    // private readonly pdfGeneratorService: PdfGeneratorService
  ) {
    SendGrid.setApiKey(process.env.SENDGRID_KEY);
    this.nodemailerTransport = nodemailer.createTransport({
      pool: true,
      service: 'Gmail',
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    this.mode = process.env.NODE_ENV;
  }

  sendMailReset(mail) {
    return SendGrid.send(mail)
  }

  async sendEmail(
    to_email: string,
    subject = 'Send Otp for verification email',
    text: string,
    html = null,
  ) {
    const payload: any = {
      to: to_email,
      from: process.env.SENDER_EMAIL,
      subject: subject,
      text: text,
    };
    if (html) {
      payload.html = html;
    }

    try {
      if (this.mode === 'development') {
        await this.nodemailerTransport.sendMail(payload);
        return { send_message: true };
      }

      const job = await this.speakingQue.add(
        QUEUE_NAME,
        payload,
      );

      return { jobId: job.id, send_message: true };
    } catch (err) {
      throw new HttpException(
        'Email sending has problem',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendFeedbackEmail(to: string, feedback, pdfBuffer: Buffer) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Trackify" <${process.env.SMTP_USER}>`,
      to,
      subject: `Your Test Feedback`,
      text: 'Please find your feedback attached.',
      attachments: [
        {
          filename: `feedback-${feedback.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  }


}