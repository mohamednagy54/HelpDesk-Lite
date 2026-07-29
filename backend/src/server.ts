import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import ticketRoutes from './routes/ticketRoutes';
import { errorHandler } from './middleware/errorHandler';
import rateLimit from 'express-rate-limit';

// Connect to database
connectDB();

const app = express();

// Security headers
app.use(helmet());

// Enable CORS with credentials for cookie-based auth
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  if (req.query) {
    const sanitized = mongoSanitize.sanitize(req.query);
    for (const key in req.query) delete req.query[key];
    Object.assign(req.query, sanitized);
  }
  next();
});

// Rate limiting (Login)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ success: true, message: 'HelpDesk Lite API is running (TypeScript)', data: null });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in TypeScript mode on port ${PORT}`);
});
