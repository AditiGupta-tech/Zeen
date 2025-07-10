import express, { Application, Request, Response, NextFunction } from 'express'; 
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
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes e.g., /api/signup, /api/login, /api/profile
app.use('/api', authRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Zeen Backend API is running!');
});

// 404 Handler (Middleware for routes not found)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global Error Handler (Middleware for handling errors)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));