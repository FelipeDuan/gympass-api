import type { UserDTO } from '@/modules/users/users.dto';
import type { CreateUserSchema } from '@/modules/users/users.schemas';
import type {
  serializeUser,
  serializeUsersPage,
} from '@/modules/users/users.serializers';

export interface IUsersService {
  create(data: CreateUserSchema): Promise<UserDTO>;
  findAll(
    page: number,
    limit: number,
  ): Promise<ReturnType<typeof serializeUsersPage>>;
  findById(userId: string): Promise<ReturnType<typeof serializeUser>>;
}
