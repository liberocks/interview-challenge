import { MedicationEntity } from "../medication/interface";
import { PatientEntity } from "../patient";

export interface AssignmentEntity {
  id: string;
  patientId: string;
  medicationId: string;
  startDate?: Date;
  numberOfDays: number;
  remainingDays: number;
  patient: PatientEntity;
  medication: MedicationEntity;
  createdAt: Date;
  updatedAt: Date;
}