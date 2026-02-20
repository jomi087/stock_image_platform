import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../constants/http_constants';
import { AUTH_MESSAGES } from '../messages/auth_messages';
import { verifyToken } from '../utils/jwt';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    const payload = verifyToken<{ userId: string }>(token);

    req.user = {
      userId: payload.userId,
    };
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return next(new AppError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.Session_TOKEN_EXPIRED));
      }

      if (error.name === 'JsonWebTokenError') {
        return next(new AppError(HTTP_STATUS.UNAUTHORIZED, AUTH_MESSAGES.INVALID_TOKEN));
      }
    }

    next(error);
  }
};
