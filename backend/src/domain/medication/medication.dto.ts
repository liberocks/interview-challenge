import { IsNotEmpty, IsEnum, IsPositive, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicationRequestDto {
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @Length(3, 64)
  @ApiProperty()
  dosage: string;

  @IsNotEmpty()
  @Length(3, 32)
  @ApiProperty()
  frequency: string;
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
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetMedicationResponseDto extends CreateMedicationResponseDto {}

export class GetMedicationsResponseDto {
  @ApiProperty({ type: [GetMedicationResponseDto] })
  medications: GetMedicationResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}
