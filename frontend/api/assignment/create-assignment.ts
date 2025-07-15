import { AssignmentEntity } from "./interface";

export type CreateAssignmentRequest = Pick<AssignmentEntity, 'patientId' | 'medicationId' | 'startDate' | 'numberOfDays'>;

export interface CreateAssignmentResponse extends AssignmentEntity {}

export const createAssignment = async (data: CreateAssignmentRequest) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/assignment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    console.error('Error creating assignment:', error)
    throw new Error(error.message || 'Failed to create assignment');
  });

  if (!response.ok) {
    let errorMessage = 'Failed to create assignment';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<CreateAssignmentResponse>;
}