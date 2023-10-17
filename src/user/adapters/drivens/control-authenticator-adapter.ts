import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

import { AuthDetails } from '../../app/models';
import { ForControlAuthenticating } from '../../ports/drivens';
import { UserRepo } from '../../../database/schemas';

@Injectable()
export class ControlAuthenticatorAdapter implements ForControlAuthenticating {
  constructor(private jwtService: JwtService) {}
  getAuthDetails(user: UserRepo, password: string): AuthDetails {
    const passwordMatch = compareSync(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('not allow');
    }

    const payload = { sub: user._id };

    return {
      token: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload),
    };
  }
}
