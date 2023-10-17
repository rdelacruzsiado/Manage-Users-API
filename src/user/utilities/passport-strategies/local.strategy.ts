import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthenticatedUser } from '../../app/models';
import { ForAuthenticating } from '../../ports/drivers';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private forAuthenticating: ForAuthenticating) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.forAuthenticating.login(email, password);

    if (!user) {
      throw new UnauthorizedException('not allow');
    }

    return user;
  }
}
