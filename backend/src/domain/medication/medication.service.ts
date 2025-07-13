import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { MedicationEntity } from './medication.entity';
import type { CreateMedicationRequestDto } from './medication.dto';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(MedicationEntity)
    private medicationRepo: Repository<MedicationEntity>,
  ) {}

  async create(data: CreateMedicationRequestDto): Promise<MedicationEntity> {
    const entity = this.medicationRepo.create(data);
    return this.medicationRepo.save(entity);
  }
}
