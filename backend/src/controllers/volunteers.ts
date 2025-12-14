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
    const { status, search, skills, availability } = req.query;

    let query = supabase.from('volunteers').select('*');

    // Apply filters
    if (status && typeof status === 'string') {
      query = query.eq('status', status);
    }
    
    // Search by name or email
    if (search && typeof search === 'string' && search.trim()) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Filter by skills/availability if provided (client-side filtering for array fields)
    let volunteers = (data || []) as Volunteer[];
    
    if (skills && typeof skills === 'string' && skills.trim()) {
      const skillArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillArray.length > 0) {
        volunteers = volunteers.filter((v) =>
          v.skills && skillArray.some((skill) => v.skills.includes(skill))
        );
      }
    }
    
    if (availability && typeof availability === 'string' && availability.trim()) {
      const availArray = availability.split(',').map(a => a.trim()).filter(Boolean);
      if (availArray.length > 0) {
        volunteers = volunteers.filter((v) =>
          v.availability_weekdays && availArray.some((avail) => v.availability_weekdays.includes(avail))
        );
      }
    }

    res.json(volunteers);
  } catch (error) {
    console.error('List volunteers error:', error);
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
    const {
      full_name,
      display_name,
      email,
      phone,
      pronouns,
      bio,
      admin_notes,
      status = 'active',
      skills = [],
      interests = [],
      availability_weekdays = [],
      availability_time_slots = [],
      consent_contact = true,
      consent_photo = false,
    } = req.body;

    // Validate required fields
    if (!full_name || !full_name.trim()) {
      res.status(400).json({ error: 'Full name is required', field: 'full_name' });
      return;
    }

    if (!email || !email.trim()) {
      res.status(400).json({ error: 'Email is required', field: 'email' });
      return;
    }

    if (!email.includes('@')) {
      res.status(400).json({ error: 'Invalid email format', field: 'email' });
      return;
    }

    const volunteer: Volunteer = {
      id: randomUUID(),
      full_name: full_name.trim(),
      display_name: display_name?.trim() || full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      pronouns: pronouns?.trim() || null,
      bio: bio?.trim() || null,
      admin_notes: admin_notes?.trim() || null,
      skills: Array.isArray(skills) ? skills : [],
      interests: Array.isArray(interests) ? interests : [],
      availability_weekdays: Array.isArray(availability_weekdays) ? availability_weekdays : [],
      availability_time_slots: Array.isArray(availability_time_slots) ? availability_time_slots : [],
      consent_contact: Boolean(consent_contact),
      consent_photo: Boolean(consent_photo),
      status: ['active', 'inactive', 'archived'].includes(status) ? status : 'active',
      total_hours: 0,
      total_events: 0,
      no_show_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from('volunteers')
      .insert([volunteer])
      .select();

    if (error) {
      console.error('Supabase insert error:', {
        code: error.code,
        message: error.message,
        hint: error.hint,
        details: error.details,
      });
      
      // Handle specific database errors
      if (error.code === '23505') {
        // Unique violation (email already exists)
        res.status(409).json({ error: 'Email already exists', field: 'email', code: error.code });
        return;
      }

      if (error.code === '42P01') {
        // Table doesn't exist
        res.status(500).json({ 
          error: 'Database table not found. Please run migrations.', 
          code: error.code,
          details: error.message 
        });
        return;
      }

      if (error.code === '42703') {
        // Column doesn't exist
        res.status(500).json({ 
          error: 'Database column not found. Please update schema.', 
          code: error.code,
          details: error.message,
          hint: error.hint
        });
        return;
      }

      throw error;
    }

    if (!data || data.length === 0) {
      res.status(500).json({ error: 'Failed to create volunteer - no data returned' });
      return;
    }

    // Log audit
    if (req.user) {
      await logAudit(req.user.id, 'CREATE', 'volunteers', data[0].id, {}, volunteer, req.ip);
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Create volunteer error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: `Failed to create volunteer: ${message}`,
      details: process.env.NODE_ENV === 'development' ? message : undefined
    });
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
