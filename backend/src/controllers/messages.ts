import { getSupabase } from '../services/supabase.js';
import { Request, Response } from 'express';

/**
 * POST /messages/broadcast - Send broadcast message
 */
export const broadcastMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, content, filter = {} } = req.body;
    const supabase = getSupabase();

    if (!content) {
      res.status(400).json({ error: 'Missing content' });
      return;
    }

    const newMessage = {
      from_admin: req.user?.id || '',
      broadcast_filter: filter,
      subject: subject || '',
      content,
      message_type: 'manual',
      created_at: new Date(),
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([newMessage])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * POST /messages/send - Send 1-to-1 message
 */
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { to_volunteer_id, subject, content } = req.body;
    const supabase = getSupabase();

    if (!to_volunteer_id || !content) {
      res.status(400).json({ error: 'Missing required fields: to_volunteer_id, content' });
      return;
    }

    const newMessage = {
      from_admin: req.user?.id || '',
      to_volunteer_id,
      subject: subject || '',
      content,
      message_type: 'manual',
      delivered_at: new Date(),
      created_at: new Date(),
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([newMessage])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * GET /volunteers/:id/messages - Get message history for volunteer
 */
export const getVolunteerMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('to_volunteer_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
