import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';

import { MedicationService } from './medication.service';
import {
  CreateMedicationRequestDto,
  CreateMedicationResponseDto,
} from './medication.dto';

@Controller('medication')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateMedicationResponseDto,
  })
  async create(@Body() data: CreateMedicationRequestDto, @Res() res: Response) {
    const result = await this.medicationService.create(data);

    res.status(HttpStatus.CREATED).json(result);
  }
}
