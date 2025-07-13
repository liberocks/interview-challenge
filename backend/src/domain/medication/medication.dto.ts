import { IsNotEmpty, IsEnum, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { MedicationFrequencyUnit } from './medication.entity';

export class CreateMedicationRequestDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  dosage: string;

  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  frequency: number;

  @IsNotEmpty()
  @IsEnum(MedicationFrequencyUnit)
  @ApiProperty({ enum: MedicationFrequencyUnit })
  frequencyUnit: MedicationFrequencyUnit;
}

export class CreateMedicationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dosage: string;

  @ApiProperty()
  frequency: string;

  @ApiProperty()
  frequencyUnit: MedicationFrequencyUnit;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
