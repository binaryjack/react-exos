import { Request, Response, Router } from 'express';
import { getDbData, getNextId, saveDb } from '../database/connection';
import { ApiResponse, Product } from '../types';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const products = [...data.products].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    const response: ApiResponse<Product[]> = { success: true, data: products as Product[] };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const response: ApiResponse = { success: false, error: 'Invalid product id' };
      return res.status(400).json(response);
    }
    const product = data.products.find((item) => item.id === id);
    if (!product) {
      const response: ApiResponse = { success: false, error: 'Product not found' };
      return res.status(404).json(response);
    }
    const response: ApiResponse<Product> = { success: true, data: product as Product };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body;
    if (!name || price === undefined) {
      const response: ApiResponse = { success: false, error: 'Name and price are required' };
      return res.status(400).json(response);
    }

    const data = await getDbData();
    const product: Product = {
      id: getNextId(data, 'productId'),
      name,
      price: Number(price),
      description: description || '',
      createdAt: new Date().toISOString()
    };

    data.products.push(product);
    await saveDb();

    const response: ApiResponse<Product> = { success: true, data: product };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body;
    if (!name || price === undefined) {
      const response: ApiResponse = { success: false, error: 'Name and price are required' };
      return res.status(400).json(response);
    }

    const data = await getDbData();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const response: ApiResponse = { success: false, error: 'Invalid product id' };
      return res.status(400).json(response);
    }
    const index = data.products.findIndex((item) => item.id === id);
    if (index === -1) {
      const response: ApiResponse = { success: false, error: 'Product not found' };
      return res.status(404).json(response);
    }

    const updatedProduct: Product = {
      ...data.products[index],
      name,
      price: Number(price),
      description: description || ''
    };
    data.products[index] = updatedProduct;
    await saveDb();

    const response: ApiResponse<Product> = { success: true, data: updatedProduct };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const response: ApiResponse = { success: false, error: 'Invalid product id' };
      return res.status(400).json(response);
    }
    const exists = data.products.some((item) => item.id === id);
    if (!exists) {
      const response: ApiResponse = { success: false, error: 'Product not found' };
      return res.status(404).json(response);
    }

    data.products = data.products.filter((item) => item.id !== id);
    data.billProducts = data.billProducts.filter((item) => item.productId !== id);
    await saveDb();

    const response: ApiResponse = { success: true };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

export default router;
