import { Injectable } from '@nestjs/common';
import { ForManagingUser } from '../../../user/ports/drivers';
import { ForGettingUser } from '../../ports/drivens/for-getting-user';

@Injectable()
export class GetUserAdapter implements ForGettingUser {
  constructor(private readonly forManagingUser: ForManagingUser) {}

  async findUserById(id: string) {
    return await this.forManagingUser.findUserById(id);
  }
}
