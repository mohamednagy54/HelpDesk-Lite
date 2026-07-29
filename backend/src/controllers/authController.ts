import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/User';
import { UserRole } from '../types';

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'helpdesk_lite_secret_key_2026_super_secure';
};

const getRefreshSecret = (): string => {
  return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'helpdesk_lite_secret_key_2026_super_secure';
};

const generateAccessToken = (id: string | object, role: UserRole): string => {
  return jwt.sign({ id, role }, getJwtSecret(), {
    expiresIn: '7d',
  });
};

const generateRefreshToken = (id: string | object, role: UserRole): string => {
  return jwt.sign({ id, role }, getRefreshSecret(), {
    expiresIn: '7d',
  });
};

const sendTokenResponse = (user: any, statusCode: number, res: Response, message: string) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  };

  res
    .status(statusCode)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      success: true,
      message,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken, // Also send in body for in-memory store
      },
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password', errors: [] });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists', errors: [] });
    }

    const userRole: UserRole = role && ['requester', 'staff', 'manager'].includes(role) ? (role as UserRole) : 'requester';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    if (user) {
      sendTokenResponse(user, 201, res, 'User registered successfully');
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data', errors: [] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password', errors: [] });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      sendTokenResponse(user, 200, res, 'Login successful');
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password', errors: [] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token / restore session via cookie
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken || req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token cookie', data: null });
    }

    try {
      let decoded: any;
      try {
        decoded = jwt.verify(token, getRefreshSecret());
      } catch (err) {
        decoded = jwt.verify(token, getJwtSecret());
      }

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found', data: null });
      }

      sendTokenResponse(user, 200, res, 'Token refreshed successfully');
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, invalid token cookie', data: null });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
    };

    res.clearCookie('accessToken', clearOptions);
    res.clearCookie('refreshToken', clearOptions);

    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
