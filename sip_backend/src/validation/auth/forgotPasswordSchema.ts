import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email(),
  }),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>['body'];
