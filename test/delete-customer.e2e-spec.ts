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
    describe('/ (DELETE)', () => {
      it('should return 200', async () => {
        const { insertedId } = await connection
          .collection('customer')
          .insertOne(customerStub());
        const response = await request(app.getHttpServer())
          .delete(`/customer/${insertedId}`)
          .set({ Authorization: `Bearer ${token}` });
        expect(response.status).toEqual(200);
      });

      it('Invalid ID, should return 400', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/customer/123`)
          .set({ Authorization: `Bearer ${token}` });
        expect(response.status).toEqual(400);
      });

      it('Not found route, should return 404', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/customer`)
          .set({ Authorization: `Bearer ${token}` });
        expect(response.status).toEqual(404);
      });

      it('If the user is deleted, return 200', async () => {
        const { insertedId } = await connection
          .collection('customer')
          .insertOne(customerStub());
        await connection.collection('customer').deleteOne({ _id: insertedId });
        const response = await request(app.getHttpServer())
          .delete(`/customer/${insertedId}`)
          .set({ Authorization: `Bearer ${token}` });
        expect(response.status).toEqual(200);
      });
    });
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
