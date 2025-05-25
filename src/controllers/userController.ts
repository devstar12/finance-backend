import { Request, Response } from 'express';
import * as userService from '../services/userService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ msg: 'Email already exists' });
      return;
    }

    const user = await userService.createUser(fullName, email, password);
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, fullName, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await userService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ msg: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, fullName: user.fullName, email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  res.status(200).json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
  });
};
