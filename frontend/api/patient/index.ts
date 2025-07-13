import { createPatient } from './create-patient';
import { getPatients } from './get-patients';

export *  from './create-patient'
export * from './get-patients';
export * from './interface';

export default {
  createPatient,
  getPatients,
}