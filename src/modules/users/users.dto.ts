import type { Prisma } from 'generated/prisma/client';

export type UserDTO = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    created_at: true;
  };
}>;
