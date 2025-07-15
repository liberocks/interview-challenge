import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { v7 as uuidv7 } from 'uuid';

import { AppModule } from './../src/app.module';

describe('AssignmentController (e2e)', () => {
  let app: INestApplication<App>;
  let patientId: string;
  let medicationId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Setup
    const patientResponse = await request(app.getHttpServer())
      .post('/patient')
      .send({
        name: 'John Doe',
        dateOfBirth: '1990-05-15',
      });
    patientId = patientResponse.body.id;

    const medicationResponse = await request(app.getHttpServer())
      .post('/medication')
      .send({
        name: 'Test Medication',
        dosage: '100mg',
        frequency: 'Once daily',
      });
    medicationId = medicationResponse.body.id;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/assignment (POST)', () => {
    it('should create an assignment successfully', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: patientId,
        medicationId: medicationId,
        startDate: new Date('2025-01-01'),
        numberOfDays: 30,
      };

      // Execute
      const response = await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.CREATED);

      // Assess
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('patient');
      expect(response.body).toHaveProperty('medication');
      expect(response.body.numberOfDays).toBe(createAssignmentDto.numberOfDays);
      expect(response.body).toHaveProperty('startDate');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body.patient.id).toBe(createAssignmentDto.patientId);
      expect(response.body.medication.id).toBe(
        createAssignmentDto.medicationId,
      );
    });

    it('should return 400 for non-existent patient', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: uuidv7(),
        medicationId: medicationId,
        startDate: new Date('2025-01-01'),
        numberOfDays: 30,
      };

      // Execute
      const response = await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);

      // Assess
      expect(response.body.message).toBe('Patient not found');
    });

    it('should return 400 for non-existent medication', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: patientId,
        medicationId: uuidv7(),
        startDate: new Date('2025-01-01'),
        numberOfDays: 30,
      };

      // Execute
      const response = await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);

      // Assess
      expect(response.body.message).toBe('Medication not found');
    });

    it('should return 400 for invalid patientId UUID', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: 'invalid-uuid',
        medicationId: medicationId,
        startDate: new Date('2025-01-01'),
        numberOfDays: 30,
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for invalid medicationId UUID', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: patientId,
        medicationId: 'invalid-uuid',
        startDate: new Date('2025-01-01'),
        numberOfDays: 30,
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing patientId', async () => {
      // Setup
      const createAssignmentDto = {
        medicationId: medicationId,
        startDate: new Date('2025-01-01'),
        numberOfDays: 30,
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing medicationId', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: patientId,
        startDate: new Date('2025-01-01'),
        numberOfDays: 30,
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing startDate', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: patientId,
        medicationId: medicationId,
        numberOfDays: 30,
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing numberOfDays', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: patientId,
        medicationId: medicationId,
        startDate: new Date('2025-01-01'),
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for negative numberOfDays', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: patientId,
        medicationId: medicationId,
        startDate: new Date('2025-01-01'),
        numberOfDays: -5,
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for numberOfDays exceeding 365', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: patientId,
        medicationId: medicationId,
        startDate: new Date('2025-01-01'),
        numberOfDays: 366,
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for invalid startDate', async () => {
      // Setup
      const createAssignmentDto = {
        patientId: patientId,
        medicationId: medicationId,
        startDate: 'invalid-date',
        numberOfDays: 30,
      };

      // Execute and assess
      await request(app.getHttpServer())
        .post('/assignment')
        .send(createAssignmentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/assignment (GET)', () => {
    let secondPatientId: string;
    let secondMedicationId: string;

    beforeEach(async () => {
      // Setup
      const secondPatientResponse = await request(app.getHttpServer())
        .post('/patient')
        .send({
          name: 'Jane Smith',
          dateOfBirth: '1985-12-10',
        });
      secondPatientId = secondPatientResponse.body.id;

      const secondMedicationResponse = await request(app.getHttpServer())
        .post('/medication')
        .send({
          name: 'Second Medication',
          dosage: '200mg',
          frequency: 'Twice daily',
        });
      secondMedicationId = secondMedicationResponse.body.id;

      await request(app.getHttpServer())
        .post('/assignment')
        .send({
          patientId: patientId,
          medicationId: medicationId,
          startDate: new Date('2025-01-01'),
          numberOfDays: 30,
        });

      await request(app.getHttpServer())
        .post('/assignment')
        .send({
          patientId: secondPatientId,
          medicationId: secondMedicationId,
          startDate: new Date('2025-01-15'),
          numberOfDays: 45,
        });

      await request(app.getHttpServer())
        .post('/assignment')
        .send({
          patientId: patientId,
          medicationId: secondMedicationId,
          startDate: new Date('2025-02-01'),
          numberOfDays: 60,
        });
    });

    it('should return paginated assignments', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/assignment')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(response.body.total).toBeGreaterThanOrEqual(3);
    });

    it('should return assignments with custom pagination', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/assignment?page=1&limit=2')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items).toHaveLength(2);
      expect(response.body.total).toBeGreaterThanOrEqual(2);
    });

    it('should filter assignments by patientId', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get(`/assignment?patientId=${patientId}`)
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(
        response.body.items.every(
          (assignment: { patientId: string }) =>
            assignment.patientId === patientId,
        ),
      ).toBe(true);
    });

    it('should filter assignments by medicationId', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get(`/assignment?medicationId=${medicationId}`)
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(
        response.body.items.every(
          (assignment: { medicationId: string }) =>
            assignment.medicationId === medicationId,
        ),
      ).toBe(true);
    });

    it('should filter assignments by both patientId and medicationId', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get(`/assignment?patientId=${patientId}&medicationId=${medicationId}`)
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(
        response.body.items.every(
          (assignment: { patientId: string; medicationId: string }) =>
            assignment.patientId === patientId &&
            assignment.medicationId === medicationId,
        ),
      ).toBe(true);
    });

    it('should return empty array for non-existent patientId filter', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get(`/assignment?patientId=${uuidv7()}`)
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should return 400 for invalid patientId format', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/assignment?patientId=invalid-uuid')
        .expect(HttpStatus.BAD_REQUEST);

      // Assess
      expect(response.body.message).toBe('Invalid patientId format');
    });

    it('should return 400 for limit exceeding 100', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/assignment?limit=101')
        .expect(HttpStatus.BAD_REQUEST);

      // Assess
      expect(response.body.message).toBe('Limit cannot exceed 100');
    });

    it('should handle invalid page and limit parameters gracefully', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/assignment?page=0&limit=0')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
    });

    it('should return assignment with correct structure', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/assignment')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items.length).toBeGreaterThan(0);

      const assignment = response.body.items[0];
      expect(assignment).toHaveProperty('id');
      expect(assignment).toHaveProperty('patientId');
      expect(assignment).toHaveProperty('medicationId');
      expect(assignment).toHaveProperty('startDate');
      expect(assignment).toHaveProperty('numberOfDays');
      expect(assignment).toHaveProperty('remainingDays');
      expect(assignment).toHaveProperty('patient');
      expect(assignment).toHaveProperty('medication');
      expect(assignment).toHaveProperty('createdAt');
      expect(assignment).toHaveProperty('updatedAt');
      expect(typeof assignment.id).toBe('string');
      expect(typeof assignment.patientId).toBe('string');
      expect(typeof assignment.medicationId).toBe('string');
      expect(typeof assignment.startDate).toBe('string');
      expect(typeof assignment.numberOfDays).toBe('number');
      expect(typeof assignment.remainingDays).toBe('number');
      expect(typeof assignment.createdAt).toBe('string');
      expect(typeof assignment.updatedAt).toBe('string');
    });

    it('should include patient and medication details in response', async () => {
      // Execute
      const response = await request(app.getHttpServer())
        .get('/assignment')
        .expect(HttpStatus.OK);

      // Assess
      expect(response.body.items.length).toBeGreaterThan(0);

      const assignment = response.body.items[0];
      expect(assignment.patient).toBeDefined();
      expect(assignment.medication).toBeDefined();
      expect(assignment.patient).toHaveProperty('id');
      expect(assignment.patient).toHaveProperty('name');
      expect(assignment.patient).toHaveProperty('dateOfBirth');
      expect(assignment.medication).toHaveProperty('id');
      expect(assignment.medication).toHaveProperty('name');
      expect(assignment.medication).toHaveProperty('dosage');
      expect(assignment.medication).toHaveProperty('frequency');
    });
  });
});
