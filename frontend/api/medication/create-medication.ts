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
  });

  if (!response.ok) {
    throw new Error('Failed to create medication');
  }

  return response.json() as Promise<CreateMedicationResponse>;
}