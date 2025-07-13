import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SampleModule } from './domain/sample/sample.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './domain/patient/patient.module';
import { MedicationModule } from './domain/medication/medication.module';
import { AssignmentModule } from './domain/assignment/assignment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    }),
    SampleModule,
    PatientModule,
    MedicationModule,
    AssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
