import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/patient (POST)', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
    // TODO: Add create patient tests
  });

  describe('/patient (GET)', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
    // TODO: Add get patients tests
  });
});
