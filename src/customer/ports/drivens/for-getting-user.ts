import { UserRepo } from '../../../database/schemas';

export abstract class ForGettingUser {
  abstract findUserById(id: string): Promise<UserRepo>;
}
