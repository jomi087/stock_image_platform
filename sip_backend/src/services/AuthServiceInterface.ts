export interface IAuthService {
  signin(email: string, mobile: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<string>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}
