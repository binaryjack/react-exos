import { ApiResponse, Product } from '../../../types';

const API_BASE = '/api/products';

export const productApi = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(API_BASE);
    return response.json();
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${API_BASE}/${id}`);
    return response.json();
  },

  create: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<ApiResponse<Product>> => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  update: async (id: number, product: Omit<Product, 'id' | 'createdAt'>): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
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
