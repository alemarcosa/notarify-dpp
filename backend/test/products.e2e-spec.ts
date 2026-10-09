import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products & Passports API (e2e)', () => {
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

  it('GET /api/products - should reject unauthenticated request', async () => {
    const response = await request(app.getHttpServer()).get('/api/products');
    expect(response.status).toBe(401);
  });

  it('GET /api/passport/:uuid - should return 404 for non-existent passport', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/passport/00000000-0000-0000-0000-000000000000',
    );
    expect(response.status).toBe(404);
  });
});
