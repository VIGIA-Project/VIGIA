import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

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

    // Sembrar usuario de prueba de forma independiente
    const dataSource = app.get(DataSource);
    await dataSource.query('CREATE SCHEMA IF NOT EXISTS auth');
    await dataSource.query('TRUNCATE TABLE auth.users CASCADE');

    const passwordHash = await bcrypt.hash('password', 10);
    await dataSource.query(`
      INSERT INTO auth.users (user_id, email, password_hash, role, status, must_change_password)
      VALUES ('55555555-5555-5555-5555-555555555555', 'admin@uce.edu.ec', '${passwordHash}', 'ADMIN', 'ACTIVE', false)
    `);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('debe iniciar sesión exitosamente con credenciales de administrador y retornar JWT', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@uce.edu.ec',
          password: 'password',
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('role');
      expect(response.body.role).toBe('ADMIN');

      adminToken = response.body.access_token;
    });

    it('debe rechazar el inicio de sesión si la contraseña es incorrecta (401)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@uce.edu.ec',
          password: 'incorrectpassword',
        })
        .expect(401);
    });

    it('debe rechazar el inicio de sesión si el formato de correo es inválido (400)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'admin-invalido',
          password: 'password',
        })
        .expect(400);
    });
  });

  describe('Acceso Protegido a Dashboards y APIs (RBAC)', () => {
    it('debe rechazar la consulta de métricas operativas si no se provee token Bearer (401)', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/access-control/eventos/metrics')
        .expect(401);
    });

    it('debe permitir la consulta de métricas operativas al administrador con token Bearer válido (200)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/access-control/eventos/metrics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('exitosos');
      expect(response.body).toHaveProperty('pendientes');
      expect(response.body).toHaveProperty('denegados');
    });
  });
});
