import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { PatientEntity } from './patient.entity';
import type { CreatePatientRequestDto } from './patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private sampleRepo: Repository<PatientEntity>,
  ) {}

  async create(data: CreatePatientRequestDto): Promise<PatientEntity> {
    const entity = this.sampleRepo.create(data);
    return this.sampleRepo.save(entity);
  }
}
