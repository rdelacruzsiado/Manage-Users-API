import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';
import { hashSync } from 'bcrypt';

import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { customerStub, listCustomersStub, userStub } from './stubs';
import { CreateCustomerDto } from '../src/customer/app/dtos';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let token: string;
  let idUserAuthenticated: ObjectId;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    connection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();

    await connection.dropDatabase();

    const user = userStub();
    const encryptedPassword = hashSync(user.password, 10);
    const { insertedId } = await connection
      .collection('user')
      .insertOne({ ...user, password: encryptedPassword });
    idUserAuthenticated = insertedId;
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      });
    token = response.header['set-cookie'][0].match(/token=(.*?);/i)[1];
  });

  describe('CustomerController (e2e)', () => {
    describe('/customer', () => {
      describe('/ (GET)', () => {
        let customers: CreateCustomerDto[];
        describe('List customers', () => {
          it('Should return 200 and an empty list', async () => {
            const response = await request(app.getHttpServer())
              .get('/customer')
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toEqual(0);
          });
          it('should return 200 and list of customers', async () => {
            customers = listCustomersStub(10);
            await connection.collection('customer').insertMany(
              customers.map((customer) => ({
                ...customer,
                userId: idUserAuthenticated,
              })),
            );
            const response = await request(app.getHttpServer())
              .get('/customer')
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toEqual(customers.length);
          });

          it('If user is not authenticated, should return 401', async () => {
            const response = await request(app.getHttpServer()).get(
              '/customer',
            );
            expect(response.statusCode).toBe(401);
          });
        });

        describe('Get one customer by id', () => {
          let customer: CreateCustomerDto;
          let customerId: ObjectId;

          beforeAll(async () => {
            customer = customerStub();
            const { insertedId } = await connection
              .collection('customer')
              .insertOne(customer);
            customerId = insertedId;
          });

          it('Should return 200', async () => {
            const response = await request(app.getHttpServer())
              .get(`/customer/${customerId}`)
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toEqual(customer.name);
          });

          it('If the customer is not found, should return 404', async () => {
            const response = await request(app.getHttpServer())
              .get(`/customer/652cc4e6e64ee89d1a822161`)
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(404);
          });

          it('If the customerId is invalid, should return 400', async () => {
            const response = await request(app.getHttpServer())
              .get(`/customer/456789`)
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(400);
          });

          it('If user is not authenticated, should return 401', async () => {
            const response = await request(app.getHttpServer()).get(
              '/customer/1',
            );
            expect(response.statusCode).toBe(401);
          });
        });

        describe('Get user by name, lastName or email', () => {
          it('By name, Should return 200', async () => {
            const response = await request(app.getHttpServer())
              .get(`/customer/search?name=${customers[0].name}`)
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(customers[0].name);
          });

          it('By lastName, Should return 200', async () => {
            const response = await request(app.getHttpServer())
              .get(`/customer/search?lastName=${customers[0].lastName}`)
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(200);
            expect(response.body.lastName).toBe(customers[0].lastName);
          });

          it('By email, Should return 200', async () => {
            const response = await request(app.getHttpServer())
              .get(`/customer/search?email=${customers[0].email}`)
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(200);
            expect(response.body.email).toBe(customers[0].email);
          });

          it('By name, email and lastName, Should return 200', async () => {
            const response = await request(app.getHttpServer())
              .get(
                `/customer/search?name=${customers[0].name}&lastName=${customers[0].lastName}&email=${customers[0].email}`,
              )
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(customers[0].name);
            expect(response.body.lastName).toBe(customers[0].lastName);
            expect(response.body.email).toBe(customers[0].email);
          });

          it('If user is not authenticated, should return 401', async () => {
            const response = await request(app.getHttpServer()).get(
              `/customer/search?name=${customers[0].name}`,
            );
            expect(response.statusCode).toBe(401);
          });

          it('Not found, should return a void object', async () => {
            const response = await request(app.getHttpServer())
              .get(`/customer/search?name=random`)
              .set({ Authorization: `Bearer ${token}` });
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({});
          });
        });
      });
    });
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
