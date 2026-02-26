import { z } from 'zod';

export const reorderImagesSchema = z.object({
  body: z
    .object({
      imageId: z.string().min(1, 'Image ID is required'),

      prevOrder: z.coerce.number().nullable(),

      nextOrder: z.coerce.number().nullable(),
    })
    .refine((data) => !(data.prevOrder === null && data.nextOrder === null), {
      message: 'Either prevOrder or nextOrder must be provided',
      path: ['prevOrder'],
    }),
});

export type ReorderRequest = z.infer<typeof reorderImagesSchema>['body'];
