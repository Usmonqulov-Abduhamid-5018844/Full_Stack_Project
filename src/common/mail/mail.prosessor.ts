import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('mail')
export class MailProcessor {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  @Process('sendEmail')
  async handleSendEmail(job: Job) {
    const { to, subject, text } = job.data;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        text,
      });
      console.log('Email sent to:', to);
    } catch (err) {
      console.error('Error sending email:', err);
      throw err;
    }
  }
}
