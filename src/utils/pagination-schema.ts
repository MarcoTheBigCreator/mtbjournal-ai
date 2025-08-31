import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  take: z
    .number()
    .min(1, 'Take must be at least 1')
    .max(50, 'Take cannot exceed 50')
    .default(11),
});
