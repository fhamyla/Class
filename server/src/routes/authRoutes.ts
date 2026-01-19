import express, { Request, Response } from 'express';
import { authenticateUser, getUserById, getTeachers, createTeacher, deleteTeacher } from '../services/authService.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/user/:id
router.get('/user/:id', async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/teachers
router.get('/teachers', async (req: Request, res: Response) => {
  try {
    const teachers = await getTeachers();
    res.json(teachers);
  } catch (error) {
    console.error('Error getting teachers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/teachers
router.post('/teachers', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const teacher = await createTeacher(name, email, password);
    res.status(201).json(teacher);
  } catch (error: unknown) {
    console.error('Error creating teacher:', error);
    const dbError = error as Record<string, unknown> & { code?: string };
    if (dbError.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/auth/teachers/:id
router.delete('/teachers/:id', async (req: Request, res: Response) => {
  try {
    await deleteTeacher(req.params.id);
    res.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
