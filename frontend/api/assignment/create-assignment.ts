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
  });

  if (!response.ok) {
    throw new Error('Failed to create assignment');
  }

  return response.json() as Promise<CreateAssignmentResponse>;
}