import { Request, Response, Router } from 'express';
import { getDbData, getNextId, saveDb } from '../database/connection';
import { ApiResponse, User } from '../types';

const router = Router();

// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const users = [...data.users].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    const response: ApiResponse<User[]> = { success: true, data: users as User[] };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const response: ApiResponse = { success: false, error: 'Invalid user id' };
      return res.status(400).json(response);
    }
    const user = data.users.find((item) => item.id === id);
    if (!user) {
      const response: ApiResponse = { success: false, error: 'User not found' };
      return res.status(404).json(response);
    }
    const response: ApiResponse<User> = { success: true, data: user as User };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Create user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      const response: ApiResponse = { success: false, error: 'Name and email are required' };
      return res.status(400).json(response);
    }

    const data = await getDbData();
    const emailExists = data.users.some((item) => item.email === email);
    if (emailExists) {
      const response: ApiResponse = { success: false, error: 'Email already exists' };
      return res.status(409).json(response);
    }

    const user: User = {
      id: getNextId(data, 'userId'),
      name,
      email,
      createdAt: new Date().toISOString()
    };
    data.users.push(user);
    await saveDb();
    const response: ApiResponse<User> = { success: true, data: user };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      const response: ApiResponse = { success: false, error: 'Name and email are required' };
      return res.status(400).json(response);
    }

    const data = await getDbData();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const response: ApiResponse = { success: false, error: 'Invalid user id' };
      return res.status(400).json(response);
    }
    const index = data.users.findIndex((item) => item.id === id);
    if (index === -1) {
      const response: ApiResponse = { success: false, error: 'User not found' };
      return res.status(404).json(response);
    }
    const emailExists = data.users.some((item) => item.email === email && item.id !== id);
    if (emailExists) {
      const response: ApiResponse = { success: false, error: 'Email already exists' };
      return res.status(409).json(response);
    }

    const updatedUser: User = {
      ...data.users[index],
      name,
      email
    };
    data.users[index] = updatedUser;
    await saveDb();

    const response: ApiResponse<User> = { success: true, data: updatedUser };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const data = await getDbData();
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const response: ApiResponse = { success: false, error: 'Invalid user id' };
      return res.status(400).json(response);
    }
    const exists = data.users.some((item) => item.id === id);
    if (!exists) {
      const response: ApiResponse = { success: false, error: 'User not found' };
      return res.status(404).json(response);
    }

    data.users = data.users.filter((item) => item.id !== id);
    data.billUsers = data.billUsers.filter((item) => item.userId !== id);
    await saveDb();

    const response: ApiResponse = { success: true };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = { success: false, error: (error as Error).message };
    res.status(500).json(response);
  }
});

export default router;
