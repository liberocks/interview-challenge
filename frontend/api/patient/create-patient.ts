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
  }).catch((error) => {
    console.error('Error creating patient:', error)
    throw new Error(error.message || 'Failed to create patient');
  }) ;

  if (!response.ok) {
    let errorMessage = 'Failed to create patient';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<CreatePatientResponse>;
}