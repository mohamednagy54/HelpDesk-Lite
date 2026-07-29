import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

export const roleCheck = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role?.toLowerCase();
    const allowedRoles = roles.map((r) => r.toLowerCase());

    if (!req.user || !userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this role',
        errors: [],
      });
    }
    next();
  };
};
