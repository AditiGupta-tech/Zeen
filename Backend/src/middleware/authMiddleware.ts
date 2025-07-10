import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined!');
    return res.status(500).send('Server error: JWT secret missing.');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { user: { id: string; email: string; } };
    req.user = decoded.user; 
    next();
  } catch (err) {
    console.error('Token verification failed in authMiddleware:', err);
    res.status(401).json({ message: 'Token is not valid or expired.' });
  }
};

export default authMiddleware;