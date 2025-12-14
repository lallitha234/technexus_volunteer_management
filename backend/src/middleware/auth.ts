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
  const authHeader = req.headers.authorization;
  const hasAuthHeader = !!authHeader;
  const nodeEnv = process.env.NODE_ENV;
  const hasJwtSecret = !!process.env.SUPABASE_JWT_SECRET;
  
  console.log(`[AUTH] Debug: NODE_ENV=${nodeEnv}, hasJWT_SECRET=${hasJwtSecret}, hasAuthHeader=${hasAuthHeader}`);
  
  // Development mode fallback (when no Supabase JWT secret is configured)
  // Treat as dev mode if NODE_ENV is not 'production' (includes undefined, 'development', etc.)
  const isDevMode = !nodeEnv || nodeEnv !== 'production';
  
  if (isDevMode && !hasJwtSecret) {
    if (!hasAuthHeader) {
      console.warn('⚠️  Development mode: No auth header, using default admin user');
      req.user = {
        id: 'dev-admin-' + Date.now(),
        email: 'admin@dev.local',
        role: 'admin',
        aud: 'authenticated',
      };
      next();
      return;
    }
    // If auth header exists, try to decode token (will set admin role in dev mode)
    console.warn('⚠️  Development mode: Attempting to decode token without verification');
  }

  try {
    const token = extractToken(authHeader);
    console.log(`[AUTH] Token extracted, length: ${token.length}`);
    const user = verifySupabaseToken(token);
    console.log(`[AUTH] Token verified, user: ${user.email}, role: ${user.role}, isAdmin: ${user.role === 'admin'}`);

    // Force admin role in development mode if JWT secret not set
    if (isDevMode && !hasJwtSecret && user.role !== 'admin') {
      console.warn(`[AUTH] Development mode: Forcing admin role for user ${user.email}`);
      user.role = 'admin';
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`[AUTH] Error for ${req.method} ${req.path}:`, error instanceof Error ? error.message : error);
    
    // In development mode without JWT secret, if token decode fails, use dev admin
    if (isDevMode && !hasJwtSecret) {
      console.warn('⚠️  Development mode: Token verification failed, using default admin user');
      req.user = {
        id: 'dev-admin-' + Date.now(),
        email: 'admin@dev.local',
        role: 'admin',
        aud: 'authenticated',
      };
      next();
      return;
    }
    
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
    console.log('[AUTH] requireAdmin: No user found');
    res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
    return;
  }

  console.log(`[AUTH] requireAdmin: Checking user role - user: ${req.user.email}, role: ${req.user.role}, isAdmin: ${isAdmin(req.user)}`);
  
  // In development mode, always allow admin access (for local development)
  // Treat as dev mode if NODE_ENV is undefined or not 'production'
  const nodeEnv = process.env.NODE_ENV;
  const hasJwtSecret = !!process.env.SUPABASE_JWT_SECRET;
  const isDevMode = !nodeEnv || nodeEnv !== 'production';
  
  console.log(`[AUTH] requireAdmin: isDevMode=${isDevMode}, hasJwtSecret=${hasJwtSecret}, nodeEnv=${nodeEnv}`);
  
  // In development mode, always allow admin access (bypass admin check)
  if (isDevMode) {
    console.log('[AUTH] requireAdmin: Development mode - allowing access (bypassing admin check)');
    next();
    return;
  }

  if (!isAdmin(req.user)) {
    console.log(`[AUTH] requireAdmin: Access denied - user role is ${req.user.role}, not admin`);
    res.status(403).json({ error: 'Forbidden', message: 'Admin role required' });
    return;
  }

  console.log('[AUTH] requireAdmin: Access granted');
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
