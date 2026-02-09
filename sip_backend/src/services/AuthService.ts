import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../constants/http_constants';
import { AUTH_MESSAGES } from '../messages/auth_messages';

import { IAuthRepository } from '../repositories/AuthRepositoryInterface';
import { IAuthService } from './AuthServiceInterface';
import { signToken, verifyToken } from '../utils/jwt';
import { sendMail } from '../utils/mail';
import { LOGIN_TOKEN_TTL, RESET_PASSWORD_TOKEN_TTL } from '../constants/auth-constants';

export class AuthServiceV1 implements IAuthService {
  //High-level module = Business logic layer
  constructor(
    private readonly _authRepository: IAuthRepository, //High-level modules should NOT depend on low-level modules They should depend on abstractions (interfaces)
  ) {}

  async signin(email: string, mobile: string, password: string): Promise<void> {
    const Existinguser = await this._authRepository.findByEmail(email);

    if (Existinguser) {
      throw new AppError(HTTP_STATUS.CONFLICT, AUTH_MESSAGES.USER_EXIST);
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10);

    await this._authRepository.createUser({
      email: email,
      mobile: mobile,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = signToken(
      {
        userId: user.id,
        email: user.email,
      },
      LOGIN_TOKEN_TTL,
    );

    return token;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this._authRepository.findByEmail(email);
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const resetToken = signToken(
      {
        userId: user.id,
        purpose: 'RESET_PASSWORD',
      },
      RESET_PASSWORD_TOKEN_TTL,
    );

    const subject = 'Reset your password';
    const resetLink = `${process.env.FRONTEND_RESET_URL}?token=${resetToken}`;
    const content = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire shortly.</p>
    `;

    await sendMail(user.email, subject, content);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = verifyToken<{ userId: string; purpose: string }>(token);

      if (payload.purpose !== 'RESET_PASSWORD') {
        throw new AppError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_TOKEN);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updated = await this._authRepository.updatePassword(payload.userId, hashedPassword);
      if (!updated) {
        throw new AppError(HTTP_STATUS.NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          throw new AppError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.RESET_TOKEN_EXPIRED);
        }

        if (error.name === 'JsonWebTokenError') {
          throw new AppError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_TOKEN);
        }

        throw error;
      }
    }
  }
}
