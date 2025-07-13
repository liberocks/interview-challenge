import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { ILike } from 'typeorm';

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

  async getById(id: string): Promise<MedicationEntity | null> {
    return this.medicationRepo.findOne({ where: { id } });
  }

  async paginate(
    page: number,
    limit: number,
    filters?: { name: string | null },
  ): Promise<{ items: MedicationEntity[]; total: number }> {
    const [items, total] = await this.medicationRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: filters?.name ? { name: ILike(`%${filters.name}%`) } : {},
    });

    return { items, total };
  }
}
