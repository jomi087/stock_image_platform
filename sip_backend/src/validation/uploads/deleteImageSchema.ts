import { z } from 'zod';

export const deleteImageSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export type deleteImageRequest = z.infer<typeof deleteImageSchema>['params'];
