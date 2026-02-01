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
}

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  createdAt?: string;
}

export interface BillUser {
  billId: number;
  userId: number;
  share: number;
}

export interface BillProduct {
  billId: number;
  productId: number;
  quantity: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
