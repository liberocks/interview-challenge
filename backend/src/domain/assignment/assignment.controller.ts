import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { validate as validateUuid } from 'uuid';

import { AssignmentService } from './assignment.service';
import {
  CreateAssignmentRequestDto,
  CreateAssignmentResponseDto,
} from './assignment.dto';
import { PatientService } from '../patient/patient.service';
import { MedicationService } from '../medication/medication.service';

@Controller('assignment')
export class AssignmentController {
  constructor(
    private readonly assignmentService: AssignmentService,
    private readonly patientService: PatientService,
    private readonly medicationService: MedicationService,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateAssignmentResponseDto,
  })
  async create(@Body() data: CreateAssignmentRequestDto, @Res() res: Response) {
    // Validate medication existence
    const medication = await this.medicationService.getById(data.medicationId);
    if (!medication) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Medication not found',
      });
    }

    // Validate patient existence
    const patient = await this.patientService.getById(data.patientId);
    if (!patient) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Patient not found',
      });
    }

    // Create assignment
    const result = await this.assignmentService.create(data);

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
    name: 'patientId',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'medicationId',
    required: false,
    type: String,
  })
  async getAssignments(
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('patientId') patientId?: string,
    @Query('medicationId') medicationId?: string,
  ) {
    // Validate pagination parameters
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 10;

    if (limit > 100) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Limit cannot exceed 100',
      });
    }

    // Validate patientId if provided
    if (patientId && !validateUuid(patientId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid patientId format',
      });
    }

    // Paginate assignments
    const result = await this.assignmentService.paginate(page, limit, {
      patientId,
      medicationId,
    });

    res.status(HttpStatus.OK).json(result);
  }
}
