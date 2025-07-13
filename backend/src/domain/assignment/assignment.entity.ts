import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

import { MedicationEntity } from '../medication/medication.entity';
import { PatientEntity } from '../patient/patient.entity';

@Entity({ name: 'assignments' })
export class AssignmentEntity {
  @PrimaryColumn()
  id: string = uuidv7();

  @Column()
  name: string;

  @ManyToOne(() => MedicationEntity)
  @JoinColumn({ name: 'medicationId' })
  medication: MedicationEntity;

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
