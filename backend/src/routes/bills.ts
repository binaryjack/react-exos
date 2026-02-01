import { Request, Response, Router } from 'express';
import { getDbData, getNextId, saveDb } from '../database/connection';
import { ApiResponse, Bill, BillProduct, BillUser, Product, User } from '../types';

const router = Router();

// Get all bills
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const bills = [...data.bills].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    const response: ApiResponse<Bill[]> = { success: true, data: bills as Bill[] };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Get bill by ID with users and products
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const response: ApiResponse = { success: false, error: 'Invalid bill id' };
      return res.status(400).json(response);
    }
    const bill = data.bills.find((item) => item.id === id);
    if (!bill) {
      const response: ApiResponse = { success: false, error: 'Bill not found' };
      return res.status(404).json(response);
    }

    const users = data.billUsers
      .filter((item) => item.billId === id)
      .map((item) => {
        const user = data.users.find((u) => u.id === item.userId);
        if (!user) return null;
        return { ...user, share: item.share } as User & { share: number };
      })
      .filter((item): item is User & { share: number } => Boolean(item));

    const products = data.billProducts
      .filter((item) => item.billId === id)
      .map((item) => {
        const product = data.products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { ...product, quantity: item.quantity } as Product & { quantity: number };
      })
      .filter((item): item is Product & { quantity: number } => Boolean(item));

    const response: ApiResponse = {
      success: true,
      data: { ...bill, users, products }
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Create bill
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, amount, date, userIds = [], productIds = [] } = req.body;
    if (!title || amount === undefined || !date) {
      const response: ApiResponse = { success: false, error: 'Title, amount, and date are required' };
      return res.status(400).json(response);
    }

    const data = await getDbData();
    const bill: Bill = {
      id: getNextId(data, 'billId'),
      title,
      amount: Number(amount),
      date,
      createdAt: new Date().toISOString()
    };
    data.bills.push(bill);

    const normalizedUserIds = Array.isArray(userIds) ? userIds.map((id: number) => Number(id)).filter((id: number) => !Number.isNaN(id)) : [];
    const normalizedProductIds = Array.isArray(productIds) ? productIds.map((id: number) => Number(id)).filter((id: number) => !Number.isNaN(id)) : [];

    if (normalizedUserIds.length > 0) {
      const share = 1 / normalizedUserIds.length;
      normalizedUserIds.forEach((userId) => {
        const entry: BillUser = { billId: bill.id as number, userId, share };
        data.billUsers.push(entry);
      });
    }

    if (normalizedProductIds.length > 0) {
      normalizedProductIds.forEach((productId) => {
        const entry: BillProduct = { billId: bill.id as number, productId, quantity: 1 };
        data.billProducts.push(entry);
      });
    }

    await saveDb();
    const response: ApiResponse<Bill> = { success: true, data: bill };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Update bill
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, amount, date } = req.body;
    if (!title || amount === undefined || !date) {
      const response: ApiResponse = { success: false, error: 'Title, amount, and date are required' };
      return res.status(400).json(response);
    }

    const data = await getDbData();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const response: ApiResponse = { success: false, error: 'Invalid bill id' };
      return res.status(400).json(response);
    }
    const index = data.bills.findIndex((item) => item.id === id);
    if (index === -1) {
      const response: ApiResponse = { success: false, error: 'Bill not found' };
      return res.status(404).json(response);
    }

    const updatedBill: Bill = {
      ...data.bills[index],
      title,
      amount: Number(amount),
      date
    };
    data.bills[index] = updatedBill;
    await saveDb();

    const response: ApiResponse<Bill> = { success: true, data: updatedBill };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Delete bill
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const response: ApiResponse = { success: false, error: 'Invalid bill id' };
      return res.status(400).json(response);
    }
    const exists = data.bills.some((item) => item.id === id);
    if (!exists) {
      const response: ApiResponse = { success: false, error: 'Bill not found' };
      return res.status(404).json(response);
    }

    data.bills = data.bills.filter((item) => item.id !== id);
    data.billUsers = data.billUsers.filter((item) => item.billId !== id);
    data.billProducts = data.billProducts.filter((item) => item.billId !== id);
    await saveDb();

    const response: ApiResponse = { success: true };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Add user to bill
router.post('/:id/users/:userId', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const billId = Number(req.params.id);
    const userId = Number(req.params.userId);
    if (Number.isNaN(billId) || Number.isNaN(userId)) {
      const response: ApiResponse = { success: false, error: 'Invalid bill or user id' };
      return res.status(400).json(response);
    }

    const billExists = data.bills.some((item) => item.id === billId);
    const userExists = data.users.some((item) => item.id === userId);
    if (!billExists || !userExists) {
      const response: ApiResponse = { success: false, error: 'Bill or user not found' };
      return res.status(404).json(response);
    }

    const { share } = req.body;
    const exists = data.billUsers.some((item) => item.billId === billId && item.userId === userId);
    if (!exists) {
      data.billUsers.push({ billId, userId, share: share ?? 0 });
      await saveDb();
    }

    const response: ApiResponse = { success: true };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Remove user from bill
router.delete('/:id/users/:userId', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const billId = Number(req.params.id);
    const userId = Number(req.params.userId);
    if (Number.isNaN(billId) || Number.isNaN(userId)) {
      const response: ApiResponse = { success: false, error: 'Invalid bill or user id' };
      return res.status(400).json(response);
    }

    data.billUsers = data.billUsers.filter((item) => !(item.billId === billId && item.userId === userId));
    await saveDb();
    const response: ApiResponse = { success: true };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Add product to bill
router.post('/:id/products/:productId', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const billId = Number(req.params.id);
    const productId = Number(req.params.productId);
    if (Number.isNaN(billId) || Number.isNaN(productId)) {
      const response: ApiResponse = { success: false, error: 'Invalid bill or product id' };
      return res.status(400).json(response);
    }

    const billExists = data.bills.some((item) => item.id === billId);
    const productExists = data.products.some((item) => item.id === productId);
    if (!billExists || !productExists) {
      const response: ApiResponse = { success: false, error: 'Bill or product not found' };
      return res.status(404).json(response);
    }

    const { quantity } = req.body;
    const exists = data.billProducts.some((item) => item.billId === billId && item.productId === productId);
    if (!exists) {
      data.billProducts.push({ billId, productId, quantity: quantity ?? 1 });
      await saveDb();
    }

    const response: ApiResponse = { success: true };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Remove product from bill
router.delete('/:id/products/:productId', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const billId = Number(req.params.id);
    const productId = Number(req.params.productId);
    if (Number.isNaN(billId) || Number.isNaN(productId)) {
      const response: ApiResponse = { success: false, error: 'Invalid bill or product id' };
      return res.status(400).json(response);
    }

    data.billProducts = data.billProducts.filter((item) => !(item.billId === billId && item.productId === productId));
    await saveDb();
    const response: ApiResponse = { success: true };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

export default router;
