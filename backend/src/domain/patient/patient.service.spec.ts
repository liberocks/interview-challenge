import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v7 as uuidv7 } from 'uuid';
import * as moment from 'moment';

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

    it('should create a patient successfully', async () => {
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

      mockRepository.create.mockReturnValue(mockPatientEntity);
      mockRepository.save.mockResolvedValue(mockPatientEntity);

      // Execute
      const res = await service.create(createPatientDto);

      // Assess
      expect(res.id).toEqual(mockPatientEntity.id);
      expect(res.name).toEqual(mockPatientEntity.name);
      expect(res.dateOfBirth).toEqual(mockPatientEntity.dateOfBirth);
      expect(mockRepository.create).toHaveBeenCalledWith(createPatientDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockPatientEntity);
    });
  });

  describe('getById', () => {
    it('should be defined', () => {
      expect(service.getById).toBeDefined();
    });

    it('should return a patient by ID', async () => {
      // Setup
      const patientId = uuidv7();

      const mockPatientEntity: PatientEntity = {
        id: patientId,
        name: 'Mary Jane',
        dateOfBirth: moment('1975-11-30', 'YYYY-MM-DD').toDate(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockPatientEntity);

      // Execute
      const res = await service.getById(patientId);

      // Assess
      expect(res).toBeDefined();
      expect(res?.id).toEqual(mockPatientEntity.id);
      expect(res?.name).toEqual(mockPatientEntity.name);
      expect(res?.dateOfBirth).toEqual(mockPatientEntity.dateOfBirth);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: patientId },
      });
    });
  });

  describe('paginate', () => {
    it('should be defined', () => {
      expect(service.paginate).toBeDefined();
    });

    it('should return paginated patients', async () => {
      // Setup
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

      mockRepository.findAndCount.mockResolvedValue([mockedPatients, 2]);

      // Execute
      const res = await service.paginate(1, 10);

      // Assess
      expect(res.items).toHaveLength(2);

      for (const patient of mockedPatients) {
        const retrievedPatient = res.items.find((p) => p.id === patient.id);

        expect(retrievedPatient).toBeDefined();
        expect(retrievedPatient?.id).toEqual(patient.id);
        expect(retrievedPatient?.name).toEqual(patient.name);
        expect(retrievedPatient?.dateOfBirth).toEqual(patient.dateOfBirth);
        expect(retrievedPatient?.createdAt).toEqual(patient.createdAt);
        expect(retrievedPatient?.updatedAt).toEqual(patient.updatedAt);
      }
    });

    it('should return paginated patients with name filter', async () => {
      // Setup
      const mockedPatients: PatientEntity[] = [
        {
          id: uuidv7(),
          name: 'Mary Jane',
          dateOfBirth: moment('1975-11-30', 'YYYY-MM-DD').toDate(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockedPatients, 2]);

      // Execute
      const res = await service.paginate(1, 10, { name: 'Mary' });

      // Assess
      expect(res.items).toHaveLength(1);

      for (const patient of mockedPatients) {
        const retrievedPatient = res.items.find((p) => p.id === patient.id);

        expect(retrievedPatient).toBeDefined();
        expect(retrievedPatient?.id).toEqual(patient.id);
        expect(retrievedPatient?.name).toEqual(patient.name);
        expect(retrievedPatient?.dateOfBirth).toEqual(patient.dateOfBirth);
        expect(retrievedPatient?.createdAt).toEqual(patient.createdAt);
        expect(retrievedPatient?.updatedAt).toEqual(patient.updatedAt);
      }
    });
  });
});
