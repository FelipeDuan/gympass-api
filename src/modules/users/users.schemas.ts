import { Role } from 'generated/prisma/enums';
import { z } from 'zod';
import { paginableSchema } from '@/core/utils/paginations';

export const userPublicSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: z.enum(Role),
  created_at: z.iso.datetime(),
});

export const listUsersSchema = {
  tags: ['Users'],
  summary: 'Listar usuários com paginação',
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
  summary: 'Regristrar novo usuário',
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

export const getProfileSchema = {
  tags: ['Users'],
  summary: 'Obter perfil do usuário autenticado',
  response: {
    200: userPublicSchema,
  },
};

export type CreateUserSchema = z.infer<typeof createUserSchema.body>;
