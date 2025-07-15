import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { v7 as uuidv7 } from 'uuid';
import * as moment from 'moment';
import { HttpStatus } from '@nestjs/common';

import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { CreatePatientRequestDto } from './patient.dto';
import { PatientEntity } from './patient.entity';

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

    it('should create a patient', async () => {
      // Setup
      const createPatientDto: CreatePatientRequestDto = {
        name: 'Mary Jane',
        dateOfBirth: '1975-11-30',
      };

      const mockPatientEntity: PatientEntity = {
        id: uuidv7(),
        name: createPatientDto.name,
        dateOfBirth: moment(
          createPatientDto.dateOfBirth,
          'YYYY-MM-DD',
        ).toDate(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPatientService.create.mockResolvedValue(mockPatientEntity);

      // Execute
      await controller.create(createPatientDto, mockResponse);

      // Assess
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(mockPatientEntity),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });

    it('should not create a patient if validation fails', async () => {
      // Setup
      const createPatientDto1: CreatePatientRequestDto = {
        name: 'Mary Jane',
        dateOfBirth: '11-30-1975',
      };

      const createPatientDto2: CreatePatientRequestDto = {
        name: 'Mary Jane',
        dateOfBirth: '2100-01-19',
      };

      // Execute and assess
      await controller.create(createPatientDto1, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);

      // Execute and assess
      await controller.create(createPatientDto2, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('getPatients', () => {
    it('should be defined', () => {
      expect(controller.getPatients).toBeDefined();
    });

    it('should return paginated patients', async () => {
      // Setup
      const page = 1;
      const limit = 10;

      const mockedPatients: PatientEntity[] = [
        {
          id: uuidv7(),
          name: 'Mary Jane',
          dateOfBirth: moment('1975-11-30', 'YYYY-MM-DD').toDate(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv7(),
          name: 'John Doe',
          dateOfBirth: moment('2024-07-31', 'YYYY-MM-DD').toDate(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPatientService.paginate.mockResolvedValue({
        items: mockedPatients,
        total: mockedPatients.length,
        page,
        limit,
      });

      // Execute and assess
      await controller.getPatients(mockResponse, page, limit, null);
      expect(mockResponse.json).toHaveBeenCalledWith({
        items: mockedPatients,
        total: mockedPatients.length,
        page,
        limit,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);

      // Execute and assess with name filter
      const nameFilter = 'Mary';
      await controller.getPatients(mockResponse, page, limit, nameFilter);
      expect(mockPatientService.paginate).toHaveBeenCalledWith(page, limit, {
        name: nameFilter,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
