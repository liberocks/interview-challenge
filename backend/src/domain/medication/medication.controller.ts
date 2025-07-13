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
    // Create medication
    const result = await this.medicationService.create(data);

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
  async getMedications(
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

    // Paginate medications
    const result = await this.medicationService.paginate(page, limit, { name });

    res.status(HttpStatus.OK).json(result);
  }
}
