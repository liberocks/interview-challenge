import { MedicationEntity } from "./interface";

export type CreateMedicationRequest = Pick<MedicationEntity, 'name' | 'dosage' | 'frequency'>;

export interface CreateMedicationResponse extends MedicationEntity {}

export const createMedication = async (data: CreateMedicationRequest) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/medication`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    console.error('Error creating medication:', error)
    throw new Error(error.message || 'Failed to create medication');
  });

  if (!response.ok) {
    let errorMessage = 'Failed to create medication';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<CreateMedicationResponse>;
}