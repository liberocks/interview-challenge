// Seed script for patients, medications, and assignments using @faker-js/faker
import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { v7 as uuidv7 } from 'uuid';
import { DataSource } from 'typeorm';

import { PatientEntity } from './src/domain/patient/patient.entity';
import { MedicationEntity } from './src/domain/medication/medication.entity';
import { AssignmentEntity } from './src/domain/assignment/assignment.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [PatientEntity, MedicationEntity, AssignmentEntity],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  const patientRepo = AppDataSource.getRepository(PatientEntity);
  const medicationRepo = AppDataSource.getRepository(MedicationEntity);
  const assignmentRepo = AppDataSource.getRepository(AssignmentEntity);

  // Clean up
  await assignmentRepo.clear();
  await medicationRepo.clear();
  await patientRepo.clear();

  // Patients
  const patients = Array.from({ length: 500 }).map(() => {
    return patientRepo.create({
      id: uuidv7(),
      name: faker.person.fullName(),
      dateOfBirth: faker.date.birthdate({ min: 1940, max: 2020, mode: 'year' }),
    });
  });
  await patientRepo.save(patients);

  // Medications
  const medications = Array.from({ length: 500 }).map(() => {
    return medicationRepo.create({
      id: uuidv7(),
      name: faker.commerce.productName(),
      dosage: `${faker.number.int({ min: 1, max: 500 })} mg`,
      frequency: `${faker.number.int({ min: 1, max: 3 })}x per day`,
    });
  });
  await medicationRepo.save(medications);

  // Assignments
  const assignments = Array.from({ length: 120 }).map(() => {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const medication = medications[Math.floor(Math.random() * medications.length)];
    const startDate = faker.date.recent({ days: 30 });
    return assignmentRepo.create({
      id: uuidv7(),
      patient: { id: patient.id },
      medication: { id: medication.id },
      startDate,
      numberOfDays: faker.number.int({ min: 1, max: 30 }),
    });
  });
  await assignmentRepo.save(assignments);

  console.log('Seed complete!');
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
