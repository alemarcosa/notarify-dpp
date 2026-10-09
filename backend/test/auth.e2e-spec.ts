import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication Flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /api/auth/login - should fail with wrong password', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@notarify.io',
        password: 'WrongPassword999!',
      });

    expect(response.status).toBe(401);
  });

  it('POST /api/auth/login - should fail with invalid email format', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'not-an-email',
        password: 'AdminPassword123!',
      });

    expect(response.status).toBe(400);
  });
});
