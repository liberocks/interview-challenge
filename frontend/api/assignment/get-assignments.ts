import { AssignmentEntity } from "./interface";

export interface GetAssignmentsQuery {
  page?: number;
  limit?: number;
  patientId?: string;
  medicationId?: string;
}

export interface GetAssignmentsResponse {
  items: AssignmentEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export const getAssigments = async (query: GetAssignmentsQuery) => {
  const params = new URLSearchParams();
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.patientId) params.append('patientId', query.patientId);
  if (query.medicationId) params.append('medicationId', query.medicationId);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/assignment?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }

  return response.json() as Promise<GetAssignmentsResponse>;
}