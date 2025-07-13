import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SampleEntity } from './sample.entity';

@Injectable()
export class SampleService {
  constructor(
    @InjectRepository(SampleEntity)
    private sampleRepo: Repository<SampleEntity>,
  ) {}

  async create(name: string): Promise<SampleEntity> {
    const entity = this.sampleRepo.create({ name });
    return this.sampleRepo.save(entity);
  }

  async findAll(): Promise<SampleEntity[]> {
    return this.sampleRepo.find();
  }
}
