import { Request, Response } from 'express';
import { Between } from 'typeorm';
import { AppDataSource } from '../config/db';
import { Payment } from '../entities/Payment';
import { User } from '../entities/User';

const paymentRepository = AppDataSource.getRepository(Payment);
const userRepository = AppDataSource.getRepository(User);

// Utility type for currency conversion request
interface ConversionRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
}

// Utility function to validate required fields
const validateFields = (fields: Record<string, any>, requiredFields: string[]): string | null => {
  for (const field of requiredFields) {
    if (!fields[field]) {
      return `${field} is required.`;
    }
  }
  return null;
};

export const topUp = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    const userId = req.user.id; // No more TypeScript error here

    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required.' });
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.balance[currency] = (user.balance[currency] || 0) + amount;
    await userRepository.save(user);

    const payment = paymentRepository.create({
      userId,
      type: 'topup',
      amount,
      currency,
    });
    await paymentRepository.save(payment);

    return res.status(200).json({ message: 'Top-up successful.', balance: user.balance });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

export const sendPayment = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { amount, currency } = req.body;
    const userId = req.user.id;

    const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.balance[currency] < amount) {
      throw new Error('Insufficient balance.');
    }

    user.balance[currency] -= amount;
    await queryRunner.manager.save(user);

    const payment = queryRunner.manager.create(Payment, {
      userId,
      type: 'send',
      amount,
      currency,
    });
    await queryRunner.manager.save(payment);

    await queryRunner.commitTransaction();
    return res.status(200).json({ message: 'Payment sent successfully.', balance: user.balance });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  } finally {
    await queryRunner.release();
  }
};

export const convertCurrency = async (req: Request, res: Response) => {
  try {
    const { fromCurrency, toCurrency, amount, rate }: ConversionRequest = req.body;
    const userId = req.user.id;

    const error = validateFields(req.body, ['fromCurrency', 'toCurrency', 'amount', 'rate']);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.balance[fromCurrency] < amount) {
      return res.status(400).json({ message: 'Insufficient balance in source currency.' });
    }

    // Save conversion record to the database
    const payment = paymentRepository.create({
      userId,
      type: 'convert',
      amount,
      currency: fromCurrency,
      targetCurrency: toCurrency,
      conversionRate: rate,
    });
    await paymentRepository.save(payment);

    user.balance[fromCurrency] -= amount;
    user.balance[toCurrency] = (user.balance[toCurrency] || 0) + amount * rate;
    await userRepository.save(user);

    return res.status(200).json({ message: 'Currency converted.', balance: user.balance });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    const payments = await paymentRepository.find({
      where: {
        userId,
        createdAt: Between(new Date(startDate as string), new Date(endDate as string)),
      },
      order: { createdAt: 'DESC' },
    });

    return res.status(200).json({ payments });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Fetch user balance
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ balance: user.balance });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};