import { ApiResponse, User } from '../../../types';

const API_BASE = '/api/users';

export const userApi = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const response = await fetch(API_BASE);
    return response.json();
  },

  getById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE}/${id}`);
    return response.json();
  },

  create: async (user: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  update: async (id: number, user: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
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
