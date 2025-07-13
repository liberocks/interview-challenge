import { IsNotEmpty, Length, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientRequestDto {
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  dateOfBirth: string;
}

export class CreatePatientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetPatientResponseDto extends CreatePatientResponseDto {}

export class GetPatientsResponseDto {
  @ApiProperty({ type: [GetPatientResponseDto] })
  patients: GetPatientResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}
