import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { QUEUE_NAME } from 'src/common/constants';


@Injectable()
export default class EmailService {
  private mode: string;
  private nodemailerTransport: Mail;

  constructor(
    @InjectQueue(QUEUE_NAME) private speakingQue: Queue,
    // private readonly pdfGeneratorService: PdfGeneratorService
  ) {
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
      from: `"SpeakingMate" <${process.env.SMTP_USER}>`,
      to,
      subject: `Your Mock Test Feedback`,
      text: 'Please find your feedback attached. Have a nice day.',
      attachments: [
        {
          filename: `feedback-${feedback.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  }
  async sendBookvendorOrder(to: string, orderId, pdfBuffer: Buffer) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"SpeakingMate" <${process.env.SMTP_USER}>`,
      to,
      subject: `Book Order`,
      text: 'Please Read the pdf carefully. And make ready the order.',
      attachments: [
        {
          filename: `book-order-${orderId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    return {
      send_message: true
    }
  }


}