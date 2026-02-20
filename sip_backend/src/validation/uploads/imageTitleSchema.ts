import { z } from 'zod';

export const imageTitleSchema = z.object({
  body: z.object({
    titles: z
      .union([z.string().min(1), z.array(z.string().min(1)).min(1)])
      .transform((val) => (Array.isArray(val) ? val : [val])),
  }),
});

export type imageTitleRequest = z.infer<typeof imageTitleSchema>['body'];
