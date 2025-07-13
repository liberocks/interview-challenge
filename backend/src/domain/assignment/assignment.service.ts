import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { AssignmentEntity } from './assignment.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private assignmentRepo: Repository<AssignmentEntity>,
  ) {}

  async create(
    data: Pick<AssignmentEntity, 'name' | 'medication' | 'patient'>,
  ): Promise<AssignmentEntity> {
    const entity = this.assignmentRepo.create(data);

    return this.assignmentRepo.save(entity);
  }
}
