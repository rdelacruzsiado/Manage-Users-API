import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ForControlAuthenticating, ForRepoQuerying } from '../ports/drivens';
import { ForAuthenticating, ForManagingUser } from '../ports/drivers';
import { AuthenticatedUser, User } from './models';
import { UserRepo } from '../../database/schemas';

@Injectable()
export class UserService implements ForAuthenticating, ForManagingUser {
  constructor(
    private readonly forRepoQuerying: ForRepoQuerying,
    private readonly forControlAuthenticating: ForControlAuthenticating,
  ) {}

  async login(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.forRepoQuerying.findUser({ email });

    if (!user) {
      throw new UnauthorizedException('not allow');
    }

    const authDetails = this.forControlAuthenticating.getAuthDetails(
      user,
      password,
    );

    const authenticatedUser: AuthenticatedUser = {
      ...authDetails,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    };

    return authenticatedUser;
  }

  async register(user: User, password: string): Promise<boolean> {
    const existingUser = await this.forRepoQuerying.findUser({
      email: user.email,
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    await this.forRepoQuerying.createUser(user, password);

    return true;
  }

  async findUser(user: Partial<User>): Promise<UserRepo | null> {
    return await this.forRepoQuerying.findUser(user);
  }

  async findUserById(id: string): Promise<UserRepo> {
    return await this.forRepoQuerying.findUserById(id);
  }
}
