import { Request, Response } from 'express';

export const health = async (req: Request, res: Response): Promise<void> => {
  // You can add more detailed checks here (DB, etc.)
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
};
