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
        const decoded = jwt.decode(token) as any;
        console.log('[AUTH] Decoded token keys:', decoded ? Object.keys(decoded) : 'null');
        console.log('[AUTH] Decoded token sample:', decoded ? {
          sub: decoded.sub,
          email: decoded.email,
          user_role: decoded.user_role,
          app_metadata: decoded.app_metadata,
          user_metadata: decoded.user_metadata,
        } : 'null');
        
        if (decoded) {
          // In development, treat all authenticated users as admin
          // Check user_metadata or app_metadata for role, default to admin
          const userRole = decoded.user_role || 
                          decoded.app_metadata?.role || 
                          decoded.user_metadata?.role || 
                          'admin';
          
          console.log('[AUTH] Extracted role:', userRole, '-> assigning as admin');
          
          const authUser = {
            id: decoded.sub || decoded.id,
            email: decoded.email || '',
            role: 'admin' as const, // Force admin role in dev mode
            aud: decoded.aud || 'authenticated',
          };
          
          console.log('[AUTH] Returning user:', authUser);
          return authUser;
        }
      } catch (e) {
        console.error('Token decode error:', e);
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
