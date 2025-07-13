import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssignmentEntity } from './assignment.entity';
import { AssignmentService } from './assignment.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentEntity])],
  providers: [AssignmentService],
})
export class AssignmentModule {}
