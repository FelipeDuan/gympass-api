import type { UserDTO } from './users.dto';

export function serializeUser(user: UserDTO) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at.toISOString(),
  };
}

export function serializeUsersPage(
  users: UserDTO[],
  page: number,
  total: number,
) {
  return {
    page,
    total,
    data: users.map(serializeUser),
  };
}
