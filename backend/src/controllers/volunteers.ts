import { Request, Response } from 'express';
import { getSupabase } from '../services/supabase.js';
import { Volunteer } from '../types/index.js';
import { logAudit } from './audit.js';
import { randomUUID } from 'crypto';

/**
 * GET /volunteers - List all volunteers with optional filters
 */
export const listVolunteers = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { status = 'active', search = '', skills = '', availability = '' } = req.query;

    let query = supabase.from('volunteers').select('*');

    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('full_name', `%${search}%`);

    const { data, error } = await query;

    if (error) throw error;

    // Filter by skills/availability if provided
    let volunteers = data as Volunteer[];
    if (skills) {
      const skillArray = (skills as string).split(',');
      volunteers = volunteers.filter((v) =>
        skillArray.some((skill) => v.skills.includes(skill.trim()))
      );
    }
    if (availability) {
      const availArray = (availability as string).split(',');
      volunteers = volunteers.filter((v) =>
        availArray.some((avail) => v.availability_weekdays.includes(avail.trim()))
      );
    }

    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * GET /volunteers/:id - Get single volunteer
 */
export const getVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Volunteer not found' });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * POST /volunteers - Create new volunteer
 */
export const createVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();
    const { full_name, email, phone, pronouns, skills = [], interests = [], consent_contact = true, consent_photo = false } = req.body;

    if (!full_name || !email) {
      res.status(400).json({ error: 'Missing required fields: full_name, email' });
      return;
    }

    const volunteer: Volunteer = {
      id: randomUUID(),
      full_name,
      email,
      phone: phone || '',
      pronouns: pronouns || '',
      skills: skills || [],
      interests: interests || [],
      availability_weekdays: [],
      availability_time_slots: [],
      consent_contact,
      consent_photo,
      total_hours: 0,
      total_events: 0,
      no_show_count: 0,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from('volunteers')
      .insert([volunteer])
      .select();

    if (error) throw error;

    // Log audit
    if (req.user) {
      await logAudit(req.user.id, 'CREATE', 'volunteers', data[0].id, {}, volunteer, req.ip);
    }

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * PATCH /volunteers/:id - Update volunteer
 */
export const updateVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    // Get current volunteer for audit
    const { data: oldData } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', id)
      .single();

    const updateData = {
      ...req.body,
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from('volunteers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Volunteer not found' });
      return;
    }

    // Log audit
    if (req.user) {
      await logAudit(req.user.id, 'UPDATE', 'volunteers', id, oldData, updateData, req.ip);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * DELETE /volunteers/:id - Soft delete volunteer (archive)
 */
export const deleteVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supabase = getSupabase();

    const { data: oldData } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('volunteers')
      .update({ status: 'archived', updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    if (req.user) {
      await logAudit(req.user.id, 'DELETE', 'volunteers', id, oldData, { status: 'archived' }, req.ip);
    }

    res.json({ message: 'Volunteer archived successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * POST /volunteers/:id/assign-badge - Award badge to volunteer
 */
export const assignBadge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { badge_id } = req.body;
    const supabase = getSupabase();

    if (!badge_id) {
      res.status(400).json({ error: 'Missing badge_id' });
      return;
    }

    const { data, error } = await supabase
      .from('volunteer_badges')
      .insert([
        {
          volunteer_id: id,
          badge_id,
          earned_at: new Date(),
        },
      ])
      .select();

    if (error) throw error;

    if (req.user) {
      await logAudit(req.user.id, 'ASSIGN_BADGE', 'volunteers', id, {}, { badge_id }, req.ip);
    }

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
