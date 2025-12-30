import { z } from 'zod';

export const userPublicSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  created_at: z.date(),
});

export const listUsersSchema = {
  tags: ['Users'],
  summary: 'List users with pagination',
  querystring: z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
  }),
  response: {
    200: z.object({
      data: z.array(userPublicSchema),
      page: z.number(),
      total: z.number(),
    }),
  },
};

export const createUserSchema = {
  tags: ['Users'],
  summary: 'Register a new user',
  body: z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  }),
  response: {
    201: z.object({
      user: z.object({
        id: z.uuid(),
        name: z.string(),
      }),
    }),
  },
};

export type CreateUserSchema = z.infer<typeof createUserSchema.body>;
