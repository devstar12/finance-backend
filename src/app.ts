import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/db';

import healthRoute from './routes/health|Route';
import userRoutes from './routes/userRoute';
import paymentRoutes from './routes/paymentRoute';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', healthRoute);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('DB connection error:', err));
