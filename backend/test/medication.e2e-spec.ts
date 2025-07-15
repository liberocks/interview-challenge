import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/medication (POST)', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
    // TODO: Add create medication tests
  });

  describe('/medication (GET)', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
    // TODO: Add get medications tests
  });
});
