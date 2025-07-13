import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity({ name: 'medications' })
export class MedicationEntity {
  @PrimaryColumn()
  id: string = uuidv7();

  @Column()
  name: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
