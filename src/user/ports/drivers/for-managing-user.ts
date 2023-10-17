import { UserRepo } from '../../../database/schemas';
import { User } from '../../app/models';

export abstract class ForManagingUser {
  abstract findUser(user: Partial<User>): Promise<UserRepo | null>;
  abstract findUserById(id: string): Promise<UserRepo>;
}
