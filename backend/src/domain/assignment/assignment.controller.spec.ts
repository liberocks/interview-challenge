import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { v7 as uuidv7 } from 'uuid';
import * as moment from 'moment';

import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { PatientService } from '../patient/patient.service';
import { MedicationService } from '../medication/medication.service';
import { CreateAssignmentRequestDto } from './assignment.dto';
import { AssignmentEntity } from './assignment.entity';
import { HttpStatus } from '@nestjs/common';
import { MedicationEntity } from '../medication/medication.entity';
import { PatientEntity } from '../patient/patient.entity';

describe('AssignmentController', () => {
  let controller: AssignmentController;

  const mockAssignmentService = {
    create: jest.fn(),
    getById: jest.fn(),
    paginate: jest.fn(),
  };

  const mockPatientService = {
    create: jest.fn(),
    getById: jest.fn(),
    paginate: jest.fn(),
  };

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
      controllers: [AssignmentController],
      providers: [
        {
          provide: AssignmentService,
          useValue: mockAssignmentService,
        },
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
        {
          provide: MedicationService,
          useValue: mockMedicationService,
        },
      ],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should create an assignment', async () => {
      // Setup
      const createAssigmentDto: CreateAssignmentRequestDto = {
        medicationId: uuidv7(),
        patientId: uuidv7(),
        startDate: new Date(),
        numberOfDays: 7,
      };

      const mockAssignmentEntity: AssignmentEntity = {
        id: uuidv7(),
        medication: { id: createAssigmentDto.medicationId } as MedicationEntity,
        patient: { id: createAssigmentDto.patientId } as PatientEntity,
        startDate: createAssigmentDto.startDate,
        numberOfDays: createAssigmentDto.numberOfDays,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMedicationService.getById.mockResolvedValue({
        id: createAssigmentDto.medicationId,
      } as MedicationEntity);
      mockPatientService.getById.mockResolvedValue({
        id: createAssigmentDto.patientId,
      } as PatientEntity);
      mockAssignmentService.create.mockResolvedValue(mockAssignmentEntity);

      // Execute
      await controller.create(createAssigmentDto, mockResponse);

      // Assess
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(mockAssignmentEntity),
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });

    it('should not create an assignment if specified medication is not existing', async () => {
      // Setup
      const createAssigmentDto: CreateAssignmentRequestDto = {
        medicationId: uuidv7(),
        patientId: uuidv7(),
        startDate: new Date(),
        numberOfDays: 7,
      };

      mockMedicationService.getById.mockResolvedValue(null);

      // Execute
      await controller.create(createAssigmentDto, mockResponse);

      // Assess
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Medication not found',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('should not create an assignment if specified patient is not existing', async () => {
      // Setup
      const createAssigmentDto: CreateAssignmentRequestDto = {
        medicationId: uuidv7(),
        patientId: uuidv7(),
        startDate: new Date(),
        numberOfDays: 7,
      };

      mockMedicationService.getById.mockResolvedValue({
        id: createAssigmentDto.medicationId,
      } as MedicationEntity);
      mockPatientService.getById.mockResolvedValue(null);

      // Execute
      await controller.create(createAssigmentDto, mockResponse);

      // Assess
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Patient not found',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('getAssignments', () => {
    it('should be defined', () => {
      expect(controller.getAssignments).toBeDefined();
    });

    it('should return paginated assignments', async () => {
      // Setup
      const page = 1;
      const limit = 10;

      const mockedAssignments: AssignmentEntity[] = [
        {
          id: uuidv7(),
          medication: { id: uuidv7() } as MedicationEntity,
          patient: { id: uuidv7() } as PatientEntity,
          startDate: new Date(),
          numberOfDays: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockAssignmentService.paginate.mockResolvedValue({
        items: mockedAssignments,
        totalItems: mockedAssignments.length,
        totalPages: 1,
        currentPage: page,
      });

      // Execute and assess
      await controller.getAssignments(
        mockResponse,
        page,
        limit,
        undefined,
        undefined,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        items: mockedAssignments,
        totalItems: mockedAssignments.length,
        totalPages: 1,
        currentPage: page,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);

      // Assess with filters
      const medicationId = uuidv7();
      const patientId = uuidv7();
      await controller.getAssignments(
        mockResponse,
        page,
        limit,
        medicationId,
        patientId,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        items: mockedAssignments,
        totalItems: mockedAssignments.length,
        totalPages: 1,
        currentPage: page,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
