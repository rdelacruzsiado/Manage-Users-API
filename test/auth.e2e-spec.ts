import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { hashSync } from 'bcrypt';

import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { USER_SCHEMA_NAME } from '../src/database/schemas';
import { userStub } from './stubs';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

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
  });

  beforeEach(async () => {
    await connection.dropDatabase();
  });

  describe('/auth', () => {
    describe('/register (POST)', () => {
      it('should return 201', async () => {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send(userStub())
          .expect(201);
      });

      it('should return 409 - Conflict', async () => {
        const user = userStub();
        await connection.collection(USER_SCHEMA_NAME).insertOne(user);
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(user);
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('User already exists');
      });

      it('should return 400 - Bad request', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            ...userStub(),
            email: '',
          });
        expect(response.status).toBe(400);
      });
    });

    describe('/login (POST)', () => {
      it('should return 201', async () => {
        const { password, ...newUser } = userStub();
        const encryptedPassword = hashSync(password, 10);
        await connection.collection(USER_SCHEMA_NAME).insertOne({
          ...newUser,
          password: encryptedPassword,
        });
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: newUser.email,
            password: password,
          })
          .expect(201);
        expect(response.body.user).toEqual(newUser);
      });

      it('should return 401', async () => {
        const user = userStub();
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: user.email,
            password: user.password,
          })
          .expect(401);
      });
    });
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
