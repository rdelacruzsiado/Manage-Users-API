import { CustomerRepo } from '../../../database/schemas';
import { Customer } from '../drivers';

export abstract class ForRepoQuerying {
  abstract getOneById(id: string): Promise<CustomerRepo>;
  abstract getAllByUserId(userId: string): Promise<CustomerRepo[]>;
  abstract findOne(customer: Partial<Customer>): Promise<CustomerRepo | null>;
  abstract create(customer: Customer): Promise<CustomerRepo>;
  abstract update(
    customerId: string,
    customer: Partial<Customer>,
  ): Promise<CustomerRepo>;
  abstract delete(id: string): Promise<void>;
}
