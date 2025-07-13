import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export enum MedicationFrequencyUnit {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

@Entity({ name: 'medications' })
export class MedicationEntity {
  @PrimaryColumn()
  id: string = uuidv7();

  @Column()
  name: string;

  @Column()
  dosage: string;

  @Column()
  frequency: number;

  @Column()
  frequencyUnit: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
