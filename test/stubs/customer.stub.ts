import { faker } from '@faker-js/faker';
import { CreateCustomerDto } from '../../src/customer/app/dtos';

export const customerStub = (): CreateCustomerDto => {
  return {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  };
};

export const listCustomersStub = (count: number): CreateCustomerDto[] => {
  return faker.helpers.multiple(customerStub, {
    count,
  });
};
