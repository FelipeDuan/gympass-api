import { z } from 'zod';

export const loginSchema = {
  tags: ['Auth'],
  summary: 'Login de usuário',
  body: z.object({
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  }),
  response: {
    200: z.object({
      token: z.string(),
      user: z.object({
        id: z.uuid(),
        name: z.string(),
        email: z.email(),
        role: z.enum(['ADMIN', 'USER']),
      }),
    }),
  },
};

export type LoginSchema = z.infer<typeof loginSchema.body>;

export const registerSchema = {
  tags: ['Auth'],
  summary: 'Registro de usuário',
  body: z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  }),
  response: {
    201: z.object({
      token: z.string(),
      user: z.object({
        id: z.uuid(),
        name: z.string(),
        email: z.email(),
        role: z.enum(['ADMIN', 'USER']),
      }),
    }),
  },
};

export type RegisterSchema = z.infer<typeof registerSchema.body>;
