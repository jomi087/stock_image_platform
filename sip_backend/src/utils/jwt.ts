import jwt, { SignOptions } from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../messages/error_messages';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../constants/http_constants';
import { AUTH_MESSAGES } from '../messages/auth_messages';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(ERROR_MESSAGES.JWT_ENV_ERROR);
}
export const signToken = <T extends object>(
  payload: T,
  expiresIn: SignOptions['expiresIn'],
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = <T>(token: string): T => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.RESET_TOKEN_EXPIRED);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_TOKEN);
    }

    throw error;
  }
};
