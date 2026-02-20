import { z } from 'zod';

export const editImageSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Image ID is required'),
  }),

  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').optional(),
  }),
});

export type EditImageBody = z.infer<typeof editImageSchema>['body'];
export type EditImageParams = z.infer<typeof editImageSchema>['params'];
