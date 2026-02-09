import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../../constants/validation_constants';
import { VALIDATION_MESSAGES } from '../../messages/validation_messages';

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH_REQUIRED),
  }),
});

export type resetPasswordRequest = z.infer<typeof resetPasswordSchema>['body'];
