import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../constants/http_constants';
import { logger } from '../config/logger';
import { ERROR_MESSAGES } from '../messages/error_messages';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let clientMessage: string = ERROR_MESSAGES.SOMETHING_WENT_WRONG;

  // Known / custom errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    clientMessage = err.message;
  }

  logger.error({
    method: req.method,
    path: req.originalUrl,
    clientMessage,
    error: {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    },
  });

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err }),
  });
};
