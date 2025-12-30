import { z } from 'zod';
import { paginableSchema } from '@/core/utils/paginations';

export const userPublicSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  created_at: z.iso.datetime(),
});

export const listUsersSchema = {
  tags: ['Users'],
  summary: 'List users with pagination',
  querystring: z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
  }),
  response: {
    200: paginableSchema(userPublicSchema),
  },
};

export const createUserSchema = {
  tags: ['Users'],
  summary: 'Register a new user',
  body: z.object({
    name: z
      .string({ error: 'Nome inválido.' })
      .min(3, { error: 'Precisa de no mínimo 3 caracteres.' }),
    email: z.email({ error: 'Email inválido' }),
    password: z
      .string({ error: 'Senha inválida.' })
      .min(6, { error: 'Precisa de no mínimo 6 caracteres.' }),
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
