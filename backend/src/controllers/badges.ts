import { getSupabase } from '../services/supabase.js';
import { Request, Response } from 'express';

/**
 * GET /badges - List all badges
 */
export const listBadges = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
