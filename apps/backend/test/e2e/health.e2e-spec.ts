import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1', {
      exclude: ['health', 'health/liveness', 'health/readiness'],
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('debe retornar el estado completo del sistema', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: expect.stringMatching(/^(ok|healthy|degraded|unhealthy)$/),
        uptime: expect.any(Number),
        timestamp: expect.any(String),
        version: expect.any(String),
        checks: expect.any(Object),
      });
    });

    it('debe incluir el check de base de datos', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body.checks).toHaveProperty('database');
      expect(response.body.checks.database).toMatchObject({
        status: expect.stringMatching(/^(up|down|degraded)$/),
      });
    });

    it('debe incluir el check de memoria', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body.checks).toHaveProperty('memory');
    });
  });

  describe('GET /health/liveness', () => {
    it('debe retornar alive: true cuando el proceso está vivo', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/liveness')
        .expect(200);

      expect(response.body).toMatchObject({
        alive: true,
        timestamp: expect.any(String),
      });
    });

    it('debe responder rápidamente (< 500ms)', async () => {
      const start = Date.now();
      await request(app.getHttpServer()).get('/health/liveness').expect(200);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(500);
    });
  });

  describe('GET /health/readiness', () => {
    it('debe retornar el estado de readiness con checks', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/readiness')
        .expect(200);

      expect(response.body).toMatchObject({
        ready: expect.any(Boolean),
        timestamp: expect.any(String),
        checks: expect.any(Object),
      });
    });

    it('debe incluir el check de base de datos en readiness', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/readiness')
        .expect(200);

      expect(response.body.checks).toHaveProperty('database');
    });
  });
});
