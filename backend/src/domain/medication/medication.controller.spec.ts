import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';

describe('MedicationController', () => {
  let controller: MedicationController;

  const mockMedicationService = {
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
      controllers: [MedicationController],
      providers: [
        {
          provide: MedicationService,
          useValue: mockMedicationService,
        },
      ],
    }).compile();

    controller = module.get<MedicationController>(MedicationController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });
    // TODO: Add create medication tests
  });

  describe('getMedications', () => {
    it('should be defined', () => {
      expect(controller.getMedications).toBeDefined();
    });
    // TODO: Add get medications tests
  });
});
