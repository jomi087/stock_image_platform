import jwt, { SignOptions } from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../messages/error_messages';

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
  return jwt.verify(token, JWT_SECRET) as T;
};
