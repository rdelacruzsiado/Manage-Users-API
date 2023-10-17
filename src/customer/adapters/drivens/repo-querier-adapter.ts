import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../../ports/drivers';
import { ForRepoQuerying } from '../../ports/drivens';
import { CustomerDocument, CustomerRepo } from '../../../database/schemas';

@Injectable()
export class RepoQuerierAdapter implements ForRepoQuerying {
  constructor(
    @InjectModel(CustomerRepo.name)
    private readonly customerRepo: Model<CustomerDocument>,
  ) {}
  async getOneById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const customer = await this.customerRepo.findById(id).exec();

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
  async getAllByUserId(userId: string) {
    return await this.customerRepo.find({ userId }).exec();
  }
  async findOne(customer: Partial<Customer>) {
    return await this.customerRepo
      .findOne(customer)
      .setOptions({ sanitizeFilter: true, lean: true })
      .exec();
  }
  async create(customer: Customer) {
    return await this.customerRepo.create(customer);
  }
  async update(customerId: string, customer: Partial<Customer>) {
    const updatedCustomer = await this.customerRepo.findOneAndUpdate(
      { _id: customerId },
      customer,
      { new: true },
    );

    if (!updatedCustomer) {
      throw new NotFoundException('Customer not found');
    }

    return updatedCustomer;
  }
  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    await this.customerRepo.findByIdAndDelete(id);
  }
}
