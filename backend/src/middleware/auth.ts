/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import { extractToken, verifySupabaseToken, isAdmin } from '../utils/auth.js';
import { AuthUser } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      ip?: string;
    }
  }
}

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[AUTH] Processing ${req.method} ${req.path}`);
  
  // Development mode fallback (when no Supabase JWT secret is configured)
  if (process.env.NODE_ENV === 'development' && !process.env.SUPABASE_JWT_SECRET) {
    console.warn('⚠️  Development mode: Using default admin user');
    req.user = {
      id: 'dev-admin-' + Date.now(),
      email: 'admin@dev.local',
      role: 'admin',
      aud: 'authenticated',
    };
    next();
    return;
  }

  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);
    const user = verifySupabaseToken(token);

    req.user = user;
    next();
  } catch (error) {
    console.error(`[AUTH] Error for ${req.method} ${req.path}:`, error instanceof Error ? error.message : error);
    res.status(401).json({
      error: 'Unauthorized',
      message: error instanceof Error ? error.message : 'Authentication failed',
    });
  }
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
    return;
  }

  if (!isAdmin(req.user)) {
    res.status(403).json({ error: 'Forbidden', message: 'Admin role required' });
    return;
  }

  next();
};

/**
 * Error handling middleware
 */
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error:', err.message);

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};
