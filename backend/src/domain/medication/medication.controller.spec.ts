import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { v7 as uuidv7 } from 'uuid';
import { HttpStatus } from '@nestjs/common';

import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { CreateMedicationRequestDto } from './medication.dto';
import { MedicationEntity } from './medication.entity';

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

    it('should create a medication', async () => {
      // Setup
      const createMedicationDto: CreateMedicationRequestDto = {
        name: 'Aspirin',
        dosage: '500mg',
        frequency: 'Once a day',
      };

      const mockedMedicationEntity: MedicationEntity = {
        id: uuidv7(),
        name: createMedicationDto.name,
        dosage: createMedicationDto.dosage,
        frequency: createMedicationDto.frequency,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMedicationService.create.mockResolvedValue(mockedMedicationEntity);

      // Execute
      const res = await controller.create(createMedicationDto, mockResponse);

      // Assess
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(mockedMedicationEntity),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });
  });

  describe('getMedications', () => {
    it('should be defined', () => {
      expect(controller.getMedications).toBeDefined();
    });

    it('should return paginated medications', async () => {
      // Setup
      const page = 1;
      const limit = 10;

      const mockedMedications: MedicationEntity[] = [
        {
          id: uuidv7(),
          name: 'Aspirin',
          dosage: '500mg',
          frequency: 'Once a day',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv7(),
          name: 'Ibuprofen',
          dosage: '200mg',
          frequency: 'Twice a day',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMedicationService.paginate.mockResolvedValue({
        items: mockedMedications,
        total: mockedMedications.length,
        page,
        limit,
      });

      // Execute and assess
      await controller.getMedications(mockResponse, page, limit, null);
      expect(mockResponse.json).toHaveBeenCalledWith({
        items: mockedMedications,
        total: mockedMedications.length,
        page,
        limit,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);

      // Execute and assess with name filter
      const nameFilter = 'Aspirin';
      await controller.getMedications(mockResponse, page, limit, nameFilter);
      expect(mockMedicationService.paginate).toHaveBeenCalledWith(page, limit, {
        name: nameFilter,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
