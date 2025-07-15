import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssignmentService } from './assignment.service';
import { AssignmentEntity } from './assignment.entity';
import { CreateAssignmentRequestDto } from './assignment.dto';

describe('AssignmentService', () => {
  let service: AssignmentService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: getRepositoryToken(AssignmentEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });
    // TODO: Add create assignment tests
  });

  describe('getById', () => {
    it('should be defined', () => {
      expect(service.getById).toBeDefined();
    });
    // TODO: Add getById assignment tests
  });

  describe('paginate', () => {
    it('should be defined', () => {
      expect(service.paginate).toBeDefined();
    });
    // TODO: Add paginate assignment tests
  });
});
