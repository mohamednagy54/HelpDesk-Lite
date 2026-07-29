import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

export const roleCheck = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this role',
        errors: [],
      });
    }
    next();
  };
};
