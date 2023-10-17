import { CustomerRepo } from '../../../database/schemas';

export interface Customer {
  name: string;
  lastName: string;
  email: string;
  userId: string;
}

export abstract class ForManagingCustomer {
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
