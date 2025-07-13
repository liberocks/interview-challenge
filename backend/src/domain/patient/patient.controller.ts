import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';

import { PatientService } from './patient.service';
import {
  CreatePatientRequestDto,
  CreatePatientResponseDto,
} from './patient.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: CreatePatientResponseDto })
  async create(@Body() data: CreatePatientRequestDto, @Res() res: Response) {
    const result = await this.patientService.create(data);

    res.status(HttpStatus.CREATED).json(result);
  }
}
