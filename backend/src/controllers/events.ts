import { getSupabase } from '../services/supabase.js';
import { Request, Response } from 'express';
import { Event } from '../types/index.js';
import { logAudit } from './audit.js';
import { randomUUID } from 'crypto';

/**
 * POST /events - Create new event
 */
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { title, description, location_address, start_at, end_at, tags = [] } = req.body;

    if (!title || !start_at || !end_at) {
      res.status(400).json({ error: 'Missing required fields: title, start_at, end_at' });
      return;
    }

    const newEvent: Event = {
      id: randomUUID(),
      title,
      description: description || '',
      location_address: location_address || '',
      tags: tags || [],
      start_at: new Date(start_at),
      end_at: new Date(end_at),
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: req.user?.id || '',
    };

    const { data, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select();

    if (error) throw error;

    if (req.user) {
      await logAudit(req.user.id, 'CREATE', 'events', data[0].id, {}, newEvent, req.ip);
    }

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * GET /events - List all events
 */
export const listEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { status = 'published' } = req.query;

    let query = supabase.from('events').select('*');

    if (status) query = query.eq('status', status);

    const { data, error } = await query.order('start_at', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * GET /events/:id - Get single event
 */
export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * PATCH /events/:id - Update event
 */
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data: oldData } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    const updateData = {
      ...req.body,
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (req.user) {
      await logAudit(req.user.id, 'UPDATE', 'events', id, oldData, updateData, req.ip);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * POST /events/:id/publish - Publish event
 */
export const publishEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('events')
      .update({
        status: 'published',
        published_at: new Date(),
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (req.user) {
      await logAudit(req.user.id, 'PUBLISH_EVENT', 'events', id, {}, { status: 'published' }, req.ip);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * DELETE /events/:id - Cancel event
 */
export const cancelEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('events')
      .update({
        status: 'cancelled',
        cancelled_at: new Date(),
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (req.user) {
      await logAudit(req.user.id, 'CANCEL_EVENT', 'events', id, {}, { status: 'cancelled' }, req.ip);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
