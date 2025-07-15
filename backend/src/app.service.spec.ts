import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';
import { AssignmentService } from './domain/assignment/assignment.service';
import { MedicationService } from './domain/medication/medication.service';
import { PatientService } from './domain/patient/patient.service';

describe('AppService', () => {
  let service: AppService;

  const mockAssignmentService = {
    create: jest.fn(),
    getById: jest.fn(),
    paginate: jest.fn(),
  };

  const mockMedicationService = {
    create: jest.fn(),
    getById: jest.fn(),
    paginate: jest.fn(),
  };

  const mockPatientService = {
    create: jest.fn(),
    getById: jest.fn(),
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: AssignmentService,
          useValue: mockAssignmentService,
        },
        {
          provide: MedicationService,
          useValue: mockMedicationService,
        },
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should be defined', () => {
      expect(service.getHello).toBeDefined();
    });
    // TODO: Add getHello tests
  });

  describe('runSeeder', () => {
    it('should be defined', () => {
      expect(service.runSeeder).toBeDefined();
    });
    // TODO: Add runSeeder tests
  });
});
