import { UserRepo } from '../../../database/schemas';
import { User } from '../../app/models';

export abstract class ForRepoQuerying {
  abstract findUserById(id: string): Promise<UserRepo>;
  abstract findUser(user: Partial<User>): Promise<UserRepo | null>;
  abstract createUser(user: User, password: string): Promise<UserRepo>;
}
