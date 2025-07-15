import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v7 as uuidv7 } from 'uuid';
import * as moment from 'moment';

import { AssignmentService } from './assignment.service';
import { AssignmentEntity } from './assignment.entity';
import { CreateAssignmentRequestDto } from './assignment.dto';
import { MedicationEntity } from '../medication/medication.entity';
import { PatientEntity } from '../patient/patient.entity';

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

    it('should create an assignment successfully', async () => {
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

      mockRepository.create.mockReturnValue(mockAssignmentEntity);
      mockRepository.save.mockResolvedValue(mockAssignmentEntity);

      // Execute
      const res = await service.create(createAssigmentDto);

      // Assess
      expect(res.id).toEqual(mockAssignmentEntity.id);
      expect(res.medication.id).toEqual(createAssigmentDto.medicationId);
      expect(res.patient.id).toEqual(createAssigmentDto.patientId);
      expect(res.startDate).toEqual(createAssigmentDto.startDate);
      expect(res.numberOfDays).toEqual(createAssigmentDto.numberOfDays);
      expect(res.createdAt).toBeDefined();
      expect(res.updatedAt).toBeDefined();
    });
  });

  describe('getById', () => {
    it('should be defined', () => {
      expect(service.getById).toBeDefined();
    });

    it('should return an assignment by ID', async () => {
      // Setup
      const assignmentId = uuidv7();
      const mockAssignmentEntity: AssignmentEntity = {
        id: assignmentId,
        medication: { id: uuidv7() } as MedicationEntity,
        patient: { id: uuidv7() } as PatientEntity,
        startDate: new Date(),
        numberOfDays: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedRemainingDays = Math.max(
        Number(
          moment(mockAssignmentEntity.startDate)
            .add(mockAssignmentEntity.numberOfDays, 'days')
            .diff(moment(), 'days', true)
            .toFixed(0),
        ),
        0,
      );

      mockRepository.findOne.mockResolvedValue(mockAssignmentEntity);

      // Execute
      const res = await service.getById(assignmentId);

      // Assess
      expect(res).toBeDefined();
      expect(res?.id).toEqual(mockAssignmentEntity.id);
      expect(res?.medication?.id).toEqual(mockAssignmentEntity.medication.id);
      expect(res?.patient?.id).toEqual(mockAssignmentEntity.patient.id);
      expect(res?.startDate).toEqual(mockAssignmentEntity.startDate);
      expect(res?.numberOfDays).toEqual(mockAssignmentEntity.numberOfDays);
      expect(res?.createdAt).toEqual(mockAssignmentEntity.createdAt);
      expect(res?.updatedAt).toEqual(mockAssignmentEntity.updatedAt);
      expect(res?.remainingDays).toEqual(expectedRemainingDays);
    });
  });

  describe('paginate', () => {
    it('should be defined', () => {
      expect(service.paginate).toBeDefined();
    });

    it('should return paginated assignments', async () => {
      // Setup
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
        {
          id: uuidv7(),
          medication: { id: uuidv7() } as MedicationEntity,
          patient: { id: uuidv7() } as PatientEntity,
          startDate: new Date(),
          numberOfDays: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([
        mockedAssignments,
        mockedAssignments.length,
      ]);

      // Execute and asses
      const res1 = await service.paginate(1, 10, {});

      for (const assignment of mockedAssignments) {
        const retrievedAssignment = res1.items.find(
          (a) => a.id === assignment.id,
        );

        const expectedRemainingDays = Math.max(
          Number(
            moment(retrievedAssignment?.startDate)
              .add(retrievedAssignment?.numberOfDays, 'days')
              .diff(moment(), 'days', true)
              .toFixed(0),
          ),
          0,
        );

        expect(retrievedAssignment).toBeDefined();
        expect(retrievedAssignment?.id).toEqual(assignment.id);
        expect(retrievedAssignment?.medication?.id).toEqual(
          assignment.medication.id,
        );
        expect(retrievedAssignment?.patient?.id).toEqual(assignment.patient.id);
        expect(retrievedAssignment?.startDate).toEqual(assignment.startDate);
        expect(retrievedAssignment?.numberOfDays).toEqual(
          assignment.numberOfDays,
        );
        expect(retrievedAssignment?.createdAt).toEqual(assignment.createdAt);
        expect(retrievedAssignment?.updatedAt).toEqual(assignment.updatedAt);
        expect(retrievedAssignment?.remainingDays).toEqual(
          expectedRemainingDays,
        );
      }

      // Execute and assess with filters
      const patientId = uuidv7();
      const medicationId = uuidv7();
      const res2 = await service.paginate(1, 10, {
        patientId,
        medicationId,
      });

      expect(res2.items).toHaveLength(mockedAssignments.length);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        relations: ['medication', 'patient'],
        where: {
          patient: { id: patientId },
          medication: { id: medicationId },
        },
        order: {
          id: 'DESC',
        },
      });
    });
  });
});
