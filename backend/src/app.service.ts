import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { AssignmentService } from './domain/assignment/assignment.service';
import { MedicationService } from './domain/medication/medication.service';
import { PatientService } from './domain/patient/patient.service';

@Injectable()
export class AppService {
  constructor(
    private readonly assignmentService: AssignmentService,
    private readonly patientService: PatientService,
    private readonly medicationService: MedicationService,
  ) {}

  getHello(): string {
    return 'Welcome to the backend service!';
  }

  async runSeeder(): Promise<string> {
    // Patients
    for (const _ of Array.from({ length: 120 })) {
      await this.patientService.create({
        name: faker.person.fullName(),
        dateOfBirth: faker.date
          .birthdate({
            min: 1940,
            max: 2020,
            mode: 'year',
          })
          .toISOString(),
      });
    }
    const patientsResult = await this.patientService.paginate(1, 500);
    const patients = patientsResult.items;

    // Medications
    for (const _ of Array.from({ length: 120 })) {
      await this.medicationService.create({
        name: faker.commerce.productName(),
        dosage: `${faker.number.int({ min: 1, max: 500 })} mg`,
        frequency: `${faker.number.int({ min: 1, max: 3 })}x per day`,
      });
    }
    const medicationsResult = await this.medicationService.paginate(1, 500);
    const medications = medicationsResult.items;

    // Assignments
    for (const _ of Array.from({ length: 120 })) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const medication =
        medications[Math.floor(Math.random() * medications.length)];
      const startDate = faker.date.recent({ days: 30 });

      await this.assignmentService.create({
        patientId: patient.id,
        medicationId: medication.id,
        startDate,
        numberOfDays: faker.number.int({ min: 1, max: 30 }),
      });
    }

    return 'Seeder has been run!';
  }
}
