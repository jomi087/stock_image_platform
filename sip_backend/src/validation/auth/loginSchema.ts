import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../../constants/validation_constants';
import { VALIDATION_MESSAGES } from '../../messages/validation_messages';

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH_REQUIRED),
  }),
});

export type loginRequest = z.infer<typeof loginSchema>['body'];
