import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { hashSync } from 'bcrypt';

import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { customerStub, userStub } from './stubs';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let token: string;

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
    await connection
      .collection('user')
      .insertOne({ ...user, password: encryptedPassword });
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      });
    token = response.header['set-cookie'][0].match(/token=(.*?);/i)[1];
  });

  describe('/customer', () => {
    describe('/ (PUT)', () => {
      it('Should return 200', async () => {
        const customer = customerStub();
        const { insertedId } = await connection
          .collection('customer')
          .insertOne(customerStub());
        const response = await request(app.getHttpServer())
          .put(`/customer/${insertedId}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(customer);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toEqual(customer.name);
        expect(response.body.lastName).toEqual(customer.lastName);
        expect(response.body.email).toEqual(customer.email);
      });

      it('If user is not authenticated, should return 401', async () => {
        const customer = customerStub();
        const { insertedId } = await connection
          .collection('customer')
          .insertOne(customerStub());
        const response = await request(app.getHttpServer())
          .put(`/customer/${insertedId}`)
          .send(customer);
        expect(response.statusCode).toBe(401);
      });

      it('Bad name format, should return 400', async () => {
        const customer = customerStub();
        const { insertedId } = await connection
          .collection('customer')
          .insertOne(customerStub());
        const response = await request(app.getHttpServer())
          .put(`/customer/${insertedId}`)
          .set({ Authorization: `Bearer ${token}` })
          .send({ ...customer, name: '' });
        expect(response.statusCode).toBe(400);
      });

      it('Bad lastName format, should return 400', async () => {
        const customer = customerStub();
        const { insertedId } = await connection
          .collection('customer')
          .insertOne(customerStub());
        const response = await request(app.getHttpServer())
          .put(`/customer/${insertedId}`)
          .set({ Authorization: `Bearer ${token}` })
          .send({ ...customer, lastName: '' });
        expect(response.statusCode).toBe(400);
      });

      it('Bad email format, should return 400', async () => {
        const customer = customerStub();
        const { insertedId } = await connection
          .collection('customer')
          .insertOne(customerStub());
        const response = await request(app.getHttpServer())
          .put(`/customer/${insertedId}`)
          .set({ Authorization: `Bearer ${token}` })
          .send({ ...customer, email: 'email' });
        expect(response.statusCode).toBe(400);
      });
    });
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
