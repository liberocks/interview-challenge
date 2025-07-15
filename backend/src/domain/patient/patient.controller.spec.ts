import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

describe('PatientController', () => {
  let controller: PatientController;

  const mockPatientService = {
    create: jest.fn(),
    getById: jest.fn(),
    paginate: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
      ],
    }).compile();

    controller = module.get<PatientController>(PatientController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });
    // TODO: Add create patient tests
  });

  describe('getPatients', () => {
    it('should be defined', () => {
      expect(controller.getPatients).toBeDefined();
    });
    // TODO: Add get patients tests
  });
});
