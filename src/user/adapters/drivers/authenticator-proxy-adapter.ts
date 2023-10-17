import { Injectable } from '@nestjs/common';

import { UserService } from '../../app/user.service';
import { ForAuthenticating } from '../../ports/drivers';
import { User } from '../../app/models';

@Injectable()
export class AuthenticatorProxyAdapter implements ForAuthenticating {
  constructor(private readonly userService: UserService) {}

  async login(email: string, password: string) {
    return await this.userService.login(email, password);
  }
  async register(user: User, password: string) {
    return await this.userService.register(user, password);
  }
}
