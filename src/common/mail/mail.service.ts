import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(@InjectQueue('mail') private mailQueue: Queue) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    await this.mailQueue.add('sendEmail', { to, subject, text });
  }

  async sendMailNow(to: string, subject: string, text: string) {
    await this.transporter.sendMail({ from: process.env.MAIL_USER, to, subject, text });
  }
}
