import { faker } from '@faker-js/faker';
import { RegisterDto } from '../../src/user/app/dtos';

export const userStub = (): RegisterDto => {
  return {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};
