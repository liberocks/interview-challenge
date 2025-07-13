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
  });

  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }

  return response.json() as Promise<GetPatientsResponse>;
}