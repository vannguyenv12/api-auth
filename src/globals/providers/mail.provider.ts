import nodemailer from 'nodemailer';
import { BadRequestException } from '../cores/error.core';

class MailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'michel.padberg@ethereal.email',
        pass: 'cF631h9TehRf4CUwvU'
      }
    });
  }

  public async sendEmail({ from = 'admin@gmail.com', to, subject, html }: ISendEmailPayload) {
    try {
      return this.transporter.sendMail({
        from,
        to,
        subject,
        html
      });
    } catch (error) {
      throw new BadRequestException('Failed to send email, try again');
    }
  }
}

export const mailProvider: MailProvider = new MailProvider();
