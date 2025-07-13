import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import * as moment from 'moment';

import { AssignmentEntity } from './assignment.entity';
import {
  CreateAssignmentRequestDto,
  GetAssignmentResponseDto,
} from './assignment.dto';
import { MedicationEntity } from '../medication/medication.entity';
import { PatientEntity } from '../patient/patient.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private assignmentRepo: Repository<AssignmentEntity>,
  ) {}

  async create(data: CreateAssignmentRequestDto): Promise<AssignmentEntity> {
    const entity = this.assignmentRepo.create({
      startDate: data.startDate,
      numberOfDays: data.numberOfDays,
    });

    entity.medication = { id: data.medicationId } as MedicationEntity;
    entity.patient = { id: data.patientId } as PatientEntity;

    return this.assignmentRepo.save(entity);
  }

  async paginate(
    page: number,
    limit: number,
    patientId?: string,
  ): Promise<{ items: GetAssignmentResponseDto[]; total: number }> {
    const [items, total] = await this.assignmentRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['medication', 'patient'],
      where: patientId ? { patient: { id: patientId } } : {},
    });

    // Transform items to DTO format
    const transformedItems: GetAssignmentResponseDto[] = items.map((item) => ({
      id: item.id,
      medicationId: item.medication ? item.medication.id : null,
      patientId: item.patient ? item.patient.id : null,
      startDate: item.startDate,
      numberOfDays: item.numberOfDays,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      remainingDays: Math.max(
        Number(
          moment(item.startDate)
            .add(item.numberOfDays, 'days')
            .diff(moment(), 'days', true)
            .toFixed(0),
        ),
        0,
      ),
    }));

    return { items: transformedItems, total };
  }
}
