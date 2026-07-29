import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Read token from cookies
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.cookies?.refreshToken) {
    token = req.cookies.refreshToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // 2. Fallback to Authorization header
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'helpdesk_lite_secret_key_2026_super_secure';
      const decoded = jwt.verify(token, secret) as JwtPayload;

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found', errors: [] });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, token failed', errors: [] });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no token cookie or header', errors: [] });
  }
};
