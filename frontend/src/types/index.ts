export interface User {
  id?: number;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Bill {
  id?: number;
  title: string;
  amount: number;
  date: string;
  createdAt?: string;
  users?: User[];
  products?: Product[];
}

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  createdAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
