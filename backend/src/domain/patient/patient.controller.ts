import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import * as moment from 'moment';

import { PatientService } from './patient.service';
import {
  CreatePatientRequestDto,
  CreatePatientResponseDto,
} from './patient.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: CreatePatientResponseDto })
  async create(@Body() data: CreatePatientRequestDto, @Res() res: Response) {
    // Validate patient date of birth must be in the past and valid
    if (!moment(data.dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Date of birth must be in YYYY-MM-DD format',
      });
    }

    if (moment(data.dateOfBirth, 'YYYY-MM-DD').isSameOrAfter(new Date())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Date of birth must be in the past',
      });
    }

    // Create patient
    const result = await this.patientService.create(data);

    res.status(HttpStatus.CREATED).json(result);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { default: 1 },
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { default: 10 },
    type: Number,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    schema: { default: null },
    type: String,
  })
  async getPatients(
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string | null,
  ) {
    // Validate pagination parameters
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 10;

    if (limit > 100) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Limit cannot exceed 100',
      });
    }

    if (name && name.length > 100) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Name cannot exceed 100 characters',
      });
    }

    // Paginate patients
    const result = await this.patientService.paginate(page, limit, { name });

    res.status(HttpStatus.OK).json(result);
  }
}
