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
    const { title, description, location_address, location_lat, location_lng, start_at, end_at, tags = [], estimated_volunteers, status = 'draft' } = req.body;

    if (!title || !start_at || !end_at) {
      res.status(400).json({ error: 'Missing required fields: title, start_at, end_at' });
      return;
    }

    // Ensure dates are properly parsed
    const startDate = new Date(start_at);
    const endDate = new Date(end_at);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({ error: 'Invalid date format for start_at or end_at' });
      return;
    }

    const newEvent: Event = {
      id: randomUUID(),
      title,
      description: description || '',
      location_address: location_address || '',
      location_lat: location_lat || undefined,
      location_lng: location_lng || undefined,
      tags: tags || [],
      start_at: startDate,
      end_at: endDate,
      status: status || 'draft',
      estimated_volunteers: estimated_volunteers || undefined,
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

    console.log('[updateEvent] Request received:', {
      id,
      body: req.body,
      userEmail: req.user?.email,
      userRole: req.user?.role,
    });

    const { data: oldData, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('[updateEvent] Error fetching old data:', fetchError);
      throw fetchError;
    }

    console.log('[updateEvent] Found existing event:', {
      id,
      title: oldData?.title,
    });

    const updateData = {
      ...req.body,
      updated_at: new Date(),
    };

    console.log('[updateEvent] Updating with data:', updateData);

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    console.log('[updateEvent] Update result:', {
      success: !error,
      error: error?.message,
      dataReturned: !!data,
    });

    if (error) {
      console.error('[updateEvent] Supabase error:', error);
      throw error;
    }

    if (req.user) {
      await logAudit(req.user.id, 'UPDATE', 'events', id, oldData, updateData, req.ip);
    }

    res.json(data);
  } catch (error) {
    console.error('[updateEvent] Exception:', error instanceof Error ? error.message : error);
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
 * POST /events/:id/cancel - Cancel event
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

/**
 * POST /events/:id/complete - Complete event
 */
export const completeEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('events')
      .update({
        status: 'completed',
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (req.user) {
      await logAudit(req.user.id, 'COMPLETE_EVENT', 'events', id, {}, { status: 'completed' }, req.ip);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * POST /events/:id/revert-to-draft - Revert event to draft status
 */
export const revertToDraft = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('events')
      .update({
        status: 'draft',
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (req.user) {
      await logAudit(req.user.id, 'REVERT_TO_DRAFT', 'events', id, {}, { status: 'draft' }, req.ip);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * DELETE /events/:id - Delete event (hard delete)
 */
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    // First get the event details for audit logging
    const { data: eventData } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (!eventData) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Delete the event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (req.user) {
      await logAudit(req.user.id, 'DELETE', 'events', id, eventData, {}, req.ip);
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
