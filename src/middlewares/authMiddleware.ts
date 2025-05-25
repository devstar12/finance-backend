import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db';
import { User } from '../models/user';

interface JwtPayload {
  userId: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.userId });

    if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }
    // Attach user to request
    (req as any).user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};
