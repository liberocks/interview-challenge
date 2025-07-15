import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from './../src/app.module';

describe('MedicationController (e2e)', () => {
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

  describe('/medication (POST)', () => {
    it('should create a medication successfully', async () => {
      // Setup
      const createMedicationDto = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily',
      };

      // Execute
      const response = await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.CREATED);

      // Assess
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createMedicationDto.name);
      expect(response.body.dosage).toBe(createMedicationDto.dosage);
      expect(response.body.frequency).toBe(createMedicationDto.frequency);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 400 for missing name', async () => {
      // Setup
      const createMedicationDto = {
        dosage: '100mg',
        frequency: 'Once daily',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing dosage', async () => {
      // Setup
      const createMedicationDto = {
        name: 'Aspirin',
        frequency: 'Once daily',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing frequency', async () => {
      // Setup
      const createMedicationDto = {
        name: 'Aspirin',
        dosage: '100mg',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for name too short', async () => {
      // Setup
      const createMedicationDto = {
        name: 'As', // Too short (less than 3 characters)
        dosage: '100mg',
        frequency: 'Once daily',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for name too long', async () => {
      // Setup
      const createMedicationDto = {
        name: 'A'.repeat(101), // Too long (more than 100 characters)
        dosage: '100mg',
        frequency: 'Once daily',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for dosage too short', async () => {
      // Setup
      const createMedicationDto = {
        name: 'Aspirin',
        dosage: '10', // Too short (less than 3 characters)
        frequency: 'Once daily',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for dosage too long', async () => {
      // Setup
      const createMedicationDto = {
        name: 'Aspirin',
        dosage: 'A'.repeat(65), // Too long (more than 64 characters)
        frequency: 'Once daily',
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for frequency too short', async () => {
      // Setup
      const createMedicationDto = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: '1x', // Too short (less than 3 characters)
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for frequency too long', async () => {
      // Setup
      const createMedicationDto = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'A'.repeat(33), // Too long (more than 32 characters)
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/medication')
        .send(createMedicationDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/medication (GET)', () => {
    beforeEach(async () => {
      // Setup
      await request(app.getHttpServer()).post('/medication').send({
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily',
      });

      await request(app.getHttpServer()).post('/medication').send({
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'Twice daily',
      });

      await request(app.getHttpServer()).post('/medication').send({
        name: 'Acetaminophen',
        dosage: '500mg',
        frequency: 'Three times daily',
      });
    });

    it('should return paginated medications', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/medication')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(response.body.total).toBeGreaterThanOrEqual(3);
    });

    it('should return medications with custom pagination', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/medication?page=1&limit=2')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items).toHaveLength(2);
      expect(response.body.total).toBeGreaterThanOrEqual(2);
    });

    it('should filter medications by name', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/medication?name=Aspirin')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(
        response.body.items.some((medication: { name: string }) =>
          medication.name.includes('Aspirin'),
        ),
      ).toBe(true);
    });

    it('should return empty array for non-existent name filter', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/medication?name=NonExistentMedication')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should return 400 for limit exceeding 100', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/medication?limit=101')
        .expect(HttpStatus.BAD_REQUEST);

      // Assess
      expect(response.body.message).toBe('Limit cannot exceed 100');
    });

    it('should return 400 for name exceeding 100 characters', async () => {
      // Execute
      const longName = 'A'.repeat(101);
      const response = await request(app.getHttpServer())
        .get(`/medication?name=${longName}`)
        .expect(HttpStatus.BAD_REQUEST);

      // Assess
      expect(response.body.message).toBe('Name cannot exceed 100 characters');
    });

    it('should handle invalid page and limit parameters gracefully', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/medication?page=0&limit=0')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
    });

    it('should return medication with correct structure', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/medication')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items.length).toBeGreaterThan(0);

      const medication = response.body.items[0];
      expect(medication).toHaveProperty('id');
      expect(medication).toHaveProperty('name');
      expect(medication).toHaveProperty('dosage');
      expect(medication).toHaveProperty('frequency');
      expect(medication).toHaveProperty('createdAt');
      expect(medication).toHaveProperty('updatedAt');
      expect(typeof medication.id).toBe('string');
      expect(typeof medication.name).toBe('string');
      expect(typeof medication.dosage).toBe('string');
      expect(typeof medication.frequency).toBe('string');
      expect(typeof medication.createdAt).toBe('string');
      expect(typeof medication.updatedAt).toBe('string');
    });
  });
});
