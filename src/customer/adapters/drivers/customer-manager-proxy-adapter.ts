import { Injectable } from '@nestjs/common';
import { CustomerRepo } from '../../../database/schemas';
import { CustomerService } from '../../app/customer.service';
import { Customer, ForManagingCustomer } from '../../ports/drivers';

@Injectable()
export class CustomerManagerProxyAdapter implements ForManagingCustomer {
  constructor(private readonly customerService: CustomerService) {}

  async getOneById(id: string): Promise<CustomerRepo> {
    return await this.customerService.getOneById(id);
  }

  async getAllByUserId(userId: string): Promise<CustomerRepo[]> {
    return await this.customerService.getAllByUserId(userId);
  }

  async findOne(customer: Partial<Customer>): Promise<CustomerRepo | null> {
    return await this.customerService.findOne(customer);
  }

  async create(customer: Customer): Promise<CustomerRepo> {
    return await this.customerService.create(customer);
  }

  async update(
    customerId: string,
    customer: Partial<Customer>,
  ): Promise<CustomerRepo> {
    return await this.customerService.update(customerId, customer);
  }

  async delete(id: string): Promise<void> {
    return await this.customerService.delete(id);
  }
}
