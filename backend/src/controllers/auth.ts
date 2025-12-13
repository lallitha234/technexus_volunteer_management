import { Request, Response } from 'express';
import { getSupabase } from '../services/supabase.js';

/**
 * POST /auth/login - Verify Supabase token
 * Supabase auth is primarily handled on the frontend
 */
export const loginWithSupabase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }

    const supabase = getSupabase();

    // Note: In production, authentication should be handled entirely by Supabase Auth
    // This endpoint validates that a user can login via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (!data.session) {
      res.status(401).json({ error: 'No session created' });
      return;
    }

    res.json({
      token: data.session.access_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
