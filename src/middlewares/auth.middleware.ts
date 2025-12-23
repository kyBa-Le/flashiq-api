import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({
      message: 'Unauthenticated request',
      errors: ['Access token required'],
    });
  } else {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Unauthenticated request',
        errors: ['Invalid token'],
      });
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
      if (err) {
        res.status(403).json({ message: 'Token invalid or expired' });
      }
      next();
    });
  }
};
