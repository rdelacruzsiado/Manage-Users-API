import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashSync } from 'bcrypt';

import { User } from '../../app/models';
import { ForRepoQuerying } from '../../ports/drivens';
import { UserDocument, UserRepo } from '../../../database/schemas';

@Injectable()
export class RepoQuerierAdapter implements ForRepoQuerying {
  constructor(
    @InjectModel(UserRepo.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async findUser(userFilter: Partial<User>): Promise<UserRepo | null> {
    const user = await this.userModel
      .findOne(userFilter)
      .setOptions({ sanitizeFilter: true, lean: true })
      .exec();

    return user;
  }

  async findUserById(id: string): Promise<UserRepo> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async createUser(user: User, password: string): Promise<UserRepo> {
    const passwordHashed = hashSync(password, 10);

    return this.userModel.create({
      ...user,
      password: passwordHashed,
    });
  }
}
