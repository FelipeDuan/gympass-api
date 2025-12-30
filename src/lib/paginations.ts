import { z } from 'zod';

export type Paginable<T> = {
  data: T[];
  total: number;
  page: number;
};

export const paginableSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    total: z.number(),
    page: z.number(),
  });
