import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/index.js';

/**
 * Verify JWT token from Supabase
 * The token should be signed with Supabase's JWT secret
 */
export const verifySupabaseToken = (token: string): AuthUser => {
  try {
    // Try to get JWT secret from environment
    let jwtSecret = process.env.SUPABASE_JWT_SECRET;
    
    // If not available, try to extract from token without verification (for development)
    if (!jwtSecret) {
      console.warn('⚠️  SUPABASE_JWT_SECRET not set - attempting token extraction without verification');
      try {
        const decoded = jwt.decode(token) as AuthUser & { role: string; sub: string };
        if (decoded) {
          return {
            id: decoded.sub || decoded.id,
            email: decoded.email || '',
            role: (decoded.role as 'admin' | 'volunteer') || 'volunteer',
            aud: decoded.aud,
          };
        }
      } catch (e) {
        // Fall through to error
      }
      throw new Error('SUPABASE_JWT_SECRET not configured and token could not be decoded');
    }
    
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
    }) as AuthUser & { role: string; sub: string };

    return {
      id: decoded.sub || decoded.id,
      email: decoded.email || '',
      role: (decoded.role as 'admin' | 'volunteer') || 'volunteer',
      aud: decoded.aud,
    };
  } catch (error) {
    throw new Error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract JWT from Authorization header
 */
export const extractToken = (authHeader?: string): string => {
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Invalid Authorization header format');
  }

  return parts[1];
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: AuthUser): boolean => {
  return user.role === 'admin';
};
