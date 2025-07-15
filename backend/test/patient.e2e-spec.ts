import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('PatientController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/patient (POST)', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    it('should create a patient successfully', async () => {
      // Setup
      const createPatientDto = {
        name: 'John Doe',
        dateOfBirth: '1990-05-15',
      };

      // Execute
      const response = await request(app.getHttpServer())
        .post('/patient')
        .send(createPatientDto)
        .expect(201);

      // Assess
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createPatientDto.name);
      expect(response.body.dateOfBirth).toBe('1990-05-15');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 400 for invalid date format', async () => {
      // Setup
      const createPatientDto = {
        name: 'John Doe',
        dateOfBirth: '05-15-1990', // Invalid format
      };

      // Execute
      const response = await request(app.getHttpServer())
        .post('/patient')
        .send(createPatientDto)
        .expect(400);

      // Assess
      expect(response.body.message).toEqual([
        'dateOfBirth must be formatted as YYYY-MM-DD',
      ]);
    });

    it('should return 400 for future date of birth', async () => {
      // Setup
      const createPatientDto = {
        name: 'John Doe',
        dateOfBirth: '2030-05-15', // Future date
      };

      // Execute
      const response = await request(app.getHttpServer())
        .post('/patient')
        .send(createPatientDto)
        .expect(400);

      // Assess
      expect(response.body.message).toBe('Date of birth must be in the past');
    });

    it('should return 400 for missing name', async () => {
      // Setup
      const createPatientDto = {
        dateOfBirth: '1990-05-15',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/patient')
        .send(createPatientDto)
        .expect(400);
    });

    it('should return 400 for missing date of birth', async () => {
      // Setup
      const createPatientDto = {
        name: 'John Doe',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/patient')
        .send(createPatientDto)
        .expect(400);
    });

    it('should return 400 for name too short', async () => {
      // Setup
      const createPatientDto = {
        name: 'Jo', // Too short (less than 3 characters)
        dateOfBirth: '1990-05-15',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/patient')
        .send(createPatientDto)
        .expect(400);
    });

    it('should return 400 for name too long', async () => {
      // Setup
      const createPatientDto = {
        name: 'A'.repeat(101), // Too long (more than 100 characters)
        dateOfBirth: '1990-05-15',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/patient')
        .send(createPatientDto)
        .expect(400);
    });
  });

  describe('/patient (GET)', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    beforeEach(async () => {
      // Setup
      await request(app.getHttpServer()).post('/patient').send({
        name: 'John Doe',
        dateOfBirth: '1990-05-15',
      });

      await request(app.getHttpServer()).post('/patient').send({
        name: 'Jane Smith',
        dateOfBirth: '1985-12-10',
      });

      await request(app.getHttpServer()).post('/patient').send({
        name: 'Mary Johnson',
        dateOfBirth: '1995-03-20',
      });
    });

    it('should return paginated patients', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/patient')
        .expect(200);

      // Assess
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(response.body.total).toBeGreaterThanOrEqual(3);
    });

    it('should return patients with custom pagination', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/patient?page=1&limit=2')
        .expect(200);

      // Assess
      expect(response.body.items).toHaveLength(2);
      expect(response.body.total).toBeGreaterThanOrEqual(2);
    });

    it('should filter patients by name', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/patient?name=John')
        .expect(200);

      // Assess
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(
        response.body.items.some((patient: { name: string }) =>
          patient.name.includes('John'),
        ),
      ).toBe(true);
    });

    it('should return empty array for non-existent name filter', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/patient?name=NonExistentName')
        .expect(200);

      // Assess
      expect(response.body.items).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should return 400 for limit exceeding 100', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/patient?limit=101')
        .expect(400);

      // Assess
      expect(response.body.message).toBe('Limit cannot exceed 100');
    });

    it('should return 400 for name exceeding 100 characters', async () => {
      // Execute
      const longName = 'A'.repeat(101);
      const response = await request(app.getHttpServer())
        .get(`/patient?name=${longName}`)
        .expect(400);

      // Assess
      expect(response.body.message).toBe('Name cannot exceed 100 characters');
    });

    it('should handle invalid page and limit parameters gracefully', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/patient?page=0&limit=0')
        .expect(200);

      // Assess
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
    });

    it('should return patient with correct structure', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/patient')
        .expect(200);

      // Assess
      expect(response.body.items.length).toBeGreaterThan(0);

      const patient = response.body.items[0];
      expect(patient).toHaveProperty('id');
      expect(patient).toHaveProperty('name');
      expect(patient).toHaveProperty('dateOfBirth');
      expect(patient).toHaveProperty('createdAt');
      expect(patient).toHaveProperty('updatedAt');
      expect(typeof patient.id).toBe('string');
      expect(typeof patient.name).toBe('string');
      expect(typeof patient.dateOfBirth).toBe('string');
      expect(typeof patient.createdAt).toBe('string');
      expect(typeof patient.updatedAt).toBe('string');
    });
  });
});
