import type { Prisma } from 'generated/prisma/client';

export const userSelect = {
  id: true,
  name: true,
  email: true,
  created_at: true,
} satisfies Prisma.UserSelect;

export type UserDTO = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;
