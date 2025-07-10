import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './db';
import authRoutes from './routes/auth';

dotenv.config();

const app: Application = express();

// Connect to DB
connectToDB();

// Middleware
app.use(express.json());
app.use(cors()); // In prod, restrict to frontend domain

// Routes
app.use('/api', authRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Zeen Backend API is running!');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
