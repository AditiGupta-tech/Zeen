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
  console.log('Auth Middleware: Received Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth Middleware: No token or invalid format');
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;
  console.log('Auth Middleware: Extracted token:', token ? token.substring(0, 10) + '...' : 'empty');

  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined!');
    return res.status(500).send('Server error: JWT secret missing.');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { user: { id: string; email: string; } };
    req.user = decoded.user;
    console.log('Auth Middleware: Token decoded successfully for user:', req.user.email);
    next();
  } catch (err) {
    console.error('Token verification failed in authMiddleware:', err);
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(401).json({ message: 'Token is not valid or expired.' });
  }
};

export default authMiddleware;