import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepo } from '../../database/schemas';
import { ForGettingUser, ForRepoQuerying } from '../ports/drivens';
import { Customer, ForManagingCustomer } from '../ports/drivers';

@Injectable()
export class CustomerService implements ForManagingCustomer {
  constructor(
    private readonly customerRepo: ForRepoQuerying,
    private readonly userManager: ForGettingUser,
  ) {}

  async getOneById(id: string): Promise<CustomerRepo> {
    return await this.customerRepo.getOneById(id);
  }
  async getAllByUserId(userId: string): Promise<CustomerRepo[]> {
    return await this.customerRepo.getAllByUserId(userId);
  }
  async findOne(customer: Partial<Customer>): Promise<CustomerRepo | null> {
    return await this.customerRepo.findOne(customer);
  }
  async create(customer: Customer): Promise<CustomerRepo> {
    const user = await this.userManager.findUserById(customer.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.customerRepo.create(customer);
  }
  async update(
    customerId: string,
    customer: Partial<Customer>,
  ): Promise<CustomerRepo> {
    return await this.customerRepo.update(customerId, customer);
  }
  async delete(id: string): Promise<void> {
    return await this.customerRepo.delete(id);
  }
}
