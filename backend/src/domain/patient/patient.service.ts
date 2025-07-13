import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, type Repository } from 'typeorm';

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

  async getById(id: string): Promise<PatientEntity | null> {
    return this.sampleRepo.findOne({ where: { id } });
  }

  async paginate(
    page: number,
    limit: number,
    filters?: { name: string | null },
  ): Promise<{ items: PatientEntity[]; total: number }> {
    const [items, total] = await this.sampleRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: filters?.name ? { name: ILike(`%${filters.name}%`) } : {},
    });

    return { items, total };
  }
}
