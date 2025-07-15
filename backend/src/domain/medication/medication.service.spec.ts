import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { MedicationService } from './medication.service';
import { MedicationEntity } from './medication.entity';
import { CreateMedicationRequestDto } from './medication.dto';

describe('MedicationService', () => {
  let service: MedicationService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationService,
        {
          provide: getRepositoryToken(MedicationEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MedicationService>(MedicationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });
    // TODO: Add create medication tests
  });

  describe('getById', () => {
    it('should be defined', () => {
      expect(service.getById).toBeDefined();
    });
    // TODO: Add getById medication tests
  });

  describe('paginate', () => {
    it('should be defined', () => {
      expect(service.paginate).toBeDefined();
    });
    // TODO: Add paginate medication tests
  });
});
