export interface IEmailService {
  sendResetPasswordEmail(email: string, resetLink: string): Promise<void>;
}
