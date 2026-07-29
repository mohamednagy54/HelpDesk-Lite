import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/User';
import { UserRole } from '../types';

const generateAccessToken = (id: string | object, role: UserRole): string => {
  const secret: Secret = process.env.JWT_SECRET || 'fallback_secret';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '15m', // Short-lived access token
  });
};

const generateRefreshToken = (id: string | object, role: UserRole): string => {
  const secret: Secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'fallback_refresh_secret';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '7d', // Long-lived refresh token
  });
};

const sendTokenResponse = (user: any, statusCode: number, res: Response, message: string) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  // Set cookie options
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const, // Prevents CSRF attacks
  };

  res
    .status(statusCode)
    .cookie('refreshToken', refreshToken, options)
    .json({
      success: true,
      message,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken, // Send access token in JSON body
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
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password', data: null });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists', data: null });
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
      res.status(400).json({ success: false, message: 'Invalid user data', data: null });
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
      return res.status(400).json({ success: false, message: 'Please provide email and password', data: null });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      sendTokenResponse(user, 200, res, 'Login successful');
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password', data: null });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Not authorized, no refresh token', data: null });
    }

    const secret: Secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'fallback_refresh_secret';
    
    try {
      const decoded = jwt.verify(refreshToken, secret) as any;
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found', data: null });
      }

      const accessToken = generateAccessToken(user._id, user.role);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, invalid refresh token', data: null });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // expire in 10 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    });
    
    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
