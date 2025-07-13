import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

import { MedicationEntity } from '../medication/medication.entity';
import { PatientEntity } from '../patient/patient.entity';

@Entity()
export class AssigmentEntity {
  @PrimaryColumn()
  id: string = uuidv7();

  @Column()
  name: string;

  @ManyToOne(() => MedicationEntity)
  medication: MedicationEntity;

  @ManyToOne(() => PatientEntity)
  patient: PatientEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
