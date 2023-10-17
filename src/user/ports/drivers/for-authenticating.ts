import { AuthenticatedUser, User } from '../../app/models';

export abstract class ForAuthenticating {
  abstract login(email: string, password: string): Promise<AuthenticatedUser>;
  abstract register(user: User, password: string): Promise<boolean>;
}
