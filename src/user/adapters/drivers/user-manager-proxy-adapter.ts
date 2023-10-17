import { Injectable } from '@nestjs/common';
import { User } from '../../app/models';
import { UserService } from '../../app/user.service';
import { ForManagingUser } from '../../ports/drivers';

@Injectable()
export class UserManagerAdapter implements ForManagingUser {
  constructor(private readonly userService: UserService) {}

  async findUser(user: Partial<User>) {
    return await this.userService.findUser(user);
  }

  async findUserById(id: string) {
    return await this.userService.findUserById(id);
  }
}
