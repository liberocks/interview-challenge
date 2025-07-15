import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PatientService } from './patient.service';
import { PatientEntity } from './patient.entity';
import { CreatePatientRequestDto } from './patient.dto';

describe('PatientService', () => {
  let service: PatientService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(PatientEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });
    // TODO: Add create patient tests
  });

  describe('getById', () => {
    it('should be defined', () => {
      expect(service.getById).toBeDefined();
    });
    // TODO: Add getById patient tests
  });

  describe('paginate', () => {
    it('should be defined', () => {
      expect(service.paginate).toBeDefined();
    });
    // TODO: Add paginate patient tests
  });
});
