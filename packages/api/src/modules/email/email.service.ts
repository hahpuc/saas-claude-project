import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.fromAddress = this.configService.get<string>('MAIL_FROM') || 'noreply@saasproject.com';

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST') || 'localhost',
      port: parseInt(this.configService.get<string>('MAIL_PORT') || '1025', 10),
      secure: false,
      auth: this.getAuthConfig(),
    });
  }

  private getAuthConfig() {
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASS');
    if (user && pass) {
      return { user, pass };
    }
    return undefined;
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      const result = await this.transporter.sendMail({
        from: this.fromAddress,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      this.logger.log(`Email sent to ${options.to}: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, (error as Error).stack);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.sendMail({
      to,
      subject: 'Welcome to SaaS Project',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Your account has been created successfully.</p>
        <p>You can now log in to the admin dashboard.</p>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    await this.sendMail({
      to,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Use the following token:</p>
        <p><strong>${resetToken}</strong></p>
        <p>This token expires in 1 hour. If you didn't request this, ignore this email.</p>
      `,
    });
  }

  async sendStatusChangeEmail(to: string, name: string, status: string): Promise<void> {
    await this.sendMail({
      to,
      subject: 'Account Status Update',
      html: `
        <h1>Account Status Changed</h1>
        <p>Hi ${name}, your account status has been changed to: <strong>${status}</strong></p>
      `,
    });
  }
}
