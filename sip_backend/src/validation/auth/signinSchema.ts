import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../../constants/validation_constants';
import { VALIDATION_MESSAGES } from '../../messages/validation_messages';

export const signinSchema = z.object({
  body: z.object({
    email: z.email(),
    mobile: z
      .string()
      .trim()
      .regex(/^[7-9]\d{9}$/, VALIDATION_MESSAGES.MOBILE_INVALID),
    password: z.string().min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH_REQUIRED),
  }),
});

export type signinRequest = z.infer<typeof signinSchema>['body'];
