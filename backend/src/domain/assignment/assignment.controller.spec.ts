import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { PatientService } from '../patient/patient.service';
import { MedicationService } from '../medication/medication.service';

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
    // TODO: Add create assignment tests
  });

  describe('getAssignments', () => {
    it('should be defined', () => {
      expect(controller.getAssignments).toBeDefined();
    });
    // TODO: Add get assignments tests
  });
});
