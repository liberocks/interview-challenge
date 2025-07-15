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
  }).catch((error) => {
    console.error('Error fetching assignments:', error)
    throw new Error(error.message || 'Failed to fetch assignments');
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch assignments';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<GetAssignmentsResponse>;
}