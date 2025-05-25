import { AppDataSource } from '../config/db';
import { User } from '../models/user';
import bcrypt from 'bcryptjs';

const userRepo = AppDataSource.getRepository(User);

export const createUser = async (fullName: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepo.create({ fullName, email, password: hashedPassword });
  return userRepo.save(user);
};

export const findUserByEmail = async (email: string) => {
  return userRepo.findOne({ where: { email } });
};
