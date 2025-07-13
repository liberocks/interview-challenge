import { IsNotEmpty, IsPositive, IsUUID, IsDate, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PatientEntity } from '../patient/patient.entity';
import { MedicationEntity } from '../medication/medication.entity';

export class CreateAssignmentRequestDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  patientId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  medicationId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  startDate: Date;

  @IsNotEmpty()
  @IsPositive()
  @Max(365) // Assuming a maximum of 365 days for an assignment
  @ApiProperty({ description: 'Number of days for the assignment' })
  numberOfDays: number;
}

export class CreateAssignmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  medicationId: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  numberOfDays: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetAssignmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientId: string | null;

  @ApiProperty()
  medicationId: string | null;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  numberOfDays: number;

  @ApiProperty()
  remainingDays: number;

  @ApiProperty()
  patient: PatientEntity | null;

  @ApiProperty()
  medication: MedicationEntity | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetAssignmentsResponseDto {
  @ApiProperty({ type: [GetAssignmentResponseDto] })
  assignments: GetAssignmentResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}
