import { MedicationEntity } from "./interface";

export interface GetMedicationsQuery {
  page?: number;
  limit?: number;
  name?: string;
}

 

export interface GetMedicationsResponse {
  items: MedicationEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export const getMedications = async (query: GetMedicationsQuery) => {
  const params = new URLSearchParams();
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.name) params.append('name', query.name);

  const response = await fetch(`${process.env.API}/patient?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }

  return response.json() as Promise<GetMedicationsResponse>;
}