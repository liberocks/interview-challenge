import { PatientEntity } from "./interface";

export interface CreatePatientRequest {
  name: string;
  dateOfBirth: string;
}

export interface CreatePatientResponse extends PatientEntity {}

export const createPatient = async (data: CreatePatientRequest) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create patient');
  }

  return response.json() as Promise<CreatePatientResponse>;
}