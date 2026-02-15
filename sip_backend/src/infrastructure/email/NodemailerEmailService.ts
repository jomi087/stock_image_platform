import nodemailer from 'nodemailer';
import { IEmailService } from './EmailServiceInterface';

export class NodemailerEmailService implements IEmailService {
  private transporter;

  constructor() {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
      throw new Error('Mail configuration missing');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
    const subject = 'Reset Password Request';

    const html = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire shortly.</p>
    `;

    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject,
      text: 'Reset your password using the provided link.',
      html,
    });
  }

  //more node mailer logic can be added over here eg sendOtpEmail
}
