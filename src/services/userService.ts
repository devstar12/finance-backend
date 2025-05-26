import { AppDataSource } from '../config/db';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (fullName: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepository.create({ fullName, email, password: hashedPassword });
  return userRepository.save(user);
};

export const findUserByEmail = async (email: string) => {
  return userRepository.findOne({ where: { email } });
};

export const getUserBalance = async (userId: string) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }
  return user.balance; // Assuming `balance` is a column in the `User` entity
};

export const updateUserBalance = async (userId: string, currency: string, amount: number) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  user.balance[currency] = (user.balance[currency] || 0) + amount; // Assuming `balance` is a JSON column
  await userRepository.save(user);
  return user.balance;
};
