import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v7 as uuidv7 } from 'uuid';

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

    it('should create a medication successfully', async () => {
      // Setup
      const createMedicationDto: CreateMedicationRequestDto = {
        name: 'Aspirin',
        dosage: '500mg',
        frequency: 'Once a day',
      };

      const mockMedicationEntity: MedicationEntity = {
        id: uuidv7(),
        name: createMedicationDto.name,
        dosage: createMedicationDto.dosage,
        frequency: createMedicationDto.frequency,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockMedicationEntity);
      mockRepository.save.mockResolvedValue(mockMedicationEntity);

      // Execute
      const res = await service.create(createMedicationDto);

      // Assess
      expect(res.id).toEqual(mockMedicationEntity.id);
      expect(res.name).toEqual(createMedicationDto.name);
      expect(res.dosage).toEqual(createMedicationDto.dosage);
      expect(res.frequency).toEqual(createMedicationDto.frequency);
      expect(mockRepository.create).toHaveBeenCalledWith(createMedicationDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockMedicationEntity);
    });
  });

  describe('getById', () => {
    it('should be defined', () => {
      expect(service.getById).toBeDefined();
    });

    it('should return a medication by ID', async () => {
      // Setup
      const medicationId = uuidv7();

      const mockMedicationEntity: MedicationEntity = {
        id: medicationId,
        name: 'Aspirin',
        dosage: '500mg',
        frequency: 'Once a day',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockMedicationEntity);

      // Execute
      const res = await service.getById(medicationId);

      // Assess
      expect(res).toBeDefined();
      expect(res?.id).toEqual(mockMedicationEntity.id);
      expect(res?.name).toEqual(mockMedicationEntity.name);
      expect(res?.dosage).toEqual(mockMedicationEntity.dosage);
      expect(res?.frequency).toEqual(mockMedicationEntity.frequency);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: medicationId },
      });
    });

    describe('paginate', () => {
      it('should be defined', () => {
        expect(service.paginate).toBeDefined();
      });

      it('should return paginated medications', async () => {
        // Setup
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

        mockRepository.findAndCount.mockResolvedValue([
          mockedMedications,
          mockedMedications.length,
        ]);

        // Execute
        const res = await service.paginate(1, 10);

        // Assess
        expect(res.items).toHaveLength(mockedMedications.length);

        for (const medication of mockedMedications) {
          const retrievedMedication = res.items.find(
            (m) => m.id === medication.id,
          );
          expect(retrievedMedication).toBeDefined();
          expect(retrievedMedication?.name).toEqual(medication.name);
          expect(retrievedMedication?.dosage).toEqual(medication.dosage);
          expect(retrievedMedication?.frequency).toEqual(medication.frequency);
        }
      });

      it('should return paginated medications with name filter', async () => {
        // Setup
        const mockedMedications: MedicationEntity[] = [
          {
            id: uuidv7(),
            name: 'Aspirin',
            dosage: '500mg',
            frequency: 'Once a day',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockRepository.findAndCount.mockResolvedValue([
          mockedMedications,
          mockedMedications.length,
        ]);

        // Execute
        const res = await service.paginate(1, 10, { name: 'Aspirin' });

        // Assess
        expect(res.items).toHaveLength(mockedMedications.length);

        for (const medication of mockedMedications) {
          const retrievedMedication = res.items.find(
            (m) => m.id === medication.id,
          );
          expect(retrievedMedication).toBeDefined();
          expect(retrievedMedication?.name).toEqual(medication.name);
          expect(retrievedMedication?.dosage).toEqual(medication.dosage);
          expect(retrievedMedication?.frequency).toEqual(medication.frequency);
        }
      });
    });
  });
});
