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

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/medication?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    console.error('Error fetching medications:', error)
    throw new Error(error.message || 'Failed to fetch medications');
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch medications';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (_e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<GetMedicationsResponse>;
}