import type { PatientEntity } from "./interface";

export interface GetPatientsQuery {
  page?: number;
  limit?: number;
  name?: string;
}



export interface GetPatientsResponse {
  items: PatientEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export const getPatients = async (query: GetPatientsQuery): Promise<GetPatientsResponse> => {
  const params = new URLSearchParams();
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.name) params.append('name', query.name);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/patient?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    console.error('Error fetching patients:', error)
    throw new Error(error.message || 'Failed to fetch patients');
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch patients';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<GetPatientsResponse>;
}