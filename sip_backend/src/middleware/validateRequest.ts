import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/http_constants';
import { logger } from '../config/logger';

type RequestSchema = ZodType<{
  body?: unknown;
  query?: unknown;
  params?: unknown;
}>;

export const validateRequest =
  (schema: RequestSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body as unknown,
      query: req.query,
      params: req.params,
    });
    // console.log(req.query)

    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => err.message);

      logger.debug('Validation Error', { errors: errorMessages });
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: errorMessages[0]?.split(':')[0] || errorMessages[0] || errorMessages,
      });
      return;
    }

    if (result.data.body !== undefined) {
      req.body = result.data.body;
    }

    next();
  };
