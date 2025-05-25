import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from './src/models/user';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true, // WARNING: auto-sync entities; disable in production
  logging: false,
  entities: [User],
});
