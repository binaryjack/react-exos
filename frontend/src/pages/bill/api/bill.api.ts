import { ApiResponse, Bill } from '../../../types';

const API_BASE = '/api/bills';

export const billApi = {
  getAll: async (): Promise<ApiResponse<Bill[]>> => {
    const response = await fetch(API_BASE);
    return response.json();
  },

  getById: async (id: number): Promise<ApiResponse<Bill>> => {
    const response = await fetch(`${API_BASE}/${id}`);
    return response.json();
  },

  create: async (bill: Omit<Bill, 'id' | 'createdAt'>): Promise<ApiResponse<Bill>> => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bill),
    });
    return response.json();
  },

  update: async (id: number, bill: Omit<Bill, 'id' | 'createdAt'>): Promise<ApiResponse<Bill>> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bill),
    });
    return response.json();
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
