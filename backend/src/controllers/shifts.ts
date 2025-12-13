import { getSupabase } from '../services/supabase.js';
import { Request, Response } from 'express';

/**
 * POST /shifts - Create shift under event
 */
export const createShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_id, role_name, description, required_skills = [], start_at, end_at, seat_count = 1 } = req.body;
    const supabase = getSupabase();

    if (!event_id || !role_name || !start_at || !end_at) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newShift = {
      event_id,
      role_name,
      description: description || '',
      required_skills: required_skills || [],
      start_at: new Date(start_at),
      end_at: new Date(end_at),
      seat_count,
      filled_count: 0,
      status: 'open',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from('shifts')
      .insert([newShift])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * GET /events/:eventId/shifts - Get shifts for event
 */
export const getEventShifts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('event_id', eventId)
      .order('start_at', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * POST /shifts/:id/assign - Assign volunteer to shift
 */
export const assignVolunteerToShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { volunteer_id, as_waitlist = false } = req.body;
    const supabase = getSupabase();

    if (!volunteer_id) {
      res.status(400).json({ error: 'Missing volunteer_id' });
      return;
    }

    // Get shift info
    const { data: shift, error: shiftError } = await supabase
      .from('shifts')
      .select('*')
      .eq('id', id)
      .single();

    if (shiftError) throw shiftError;

    const status = as_waitlist || (shift.filled_count >= shift.seat_count) ? 'waitlist' : 'assigned';

    const newAssignment = {
      shift_id: id,
      volunteer_id,
      status,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from('shift_assignments')
      .insert([newAssignment])
      .select();

    if (error) throw error;

    // Update shift filled count if assigned
    if (status === 'assigned') {
      await supabase
        .from('shifts')
        .update({
          filled_count: shift.filled_count + 1,
          status: shift.filled_count + 1 >= shift.seat_count ? 'full' : 'open',
        })
        .eq('id', id);
    }

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * DELETE /shifts/:id/assign/:volunteerId - Unassign volunteer from shift
 */
export const unassignVolunteerFromShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, volunteerId } = req.params;
    const supabase = getSupabase();

    const { data: assignment, error: assignError } = await supabase
      .from('shift_assignments')
      .select('*')
      .eq('shift_id', id)
      .eq('volunteer_id', volunteerId)
      .single();

    if (assignError) throw assignError;

    // Delete assignment
    const { error } = await supabase
      .from('shift_assignments')
      .delete()
      .eq('id', assignment.id);

    if (error) throw error;

    // Update shift filled count
    if (assignment.status === 'assigned') {
      const { data: shift } = await supabase
        .from('shifts')
        .select('*')
        .eq('id', id)
        .single();

      if (shift) {
        await supabase
          .from('shifts')
          .update({
            filled_count: Math.max(0, shift.filled_count - 1),
            status: 'open',
          })
          .eq('id', id);
      }
    }

    // Promote from waitlist if available
    const { data: waitlisted } = await supabase
      .from('shift_assignments')
      .select('*')
      .eq('shift_id', id)
      .eq('status', 'waitlist')
      .order('created_at', { ascending: true })
      .limit(1);

    if (waitlisted && waitlisted.length > 0) {
      await supabase
        .from('shift_assignments')
        .update({ status: 'assigned' })
        .eq('id', waitlisted[0].id);

      const { data: shift } = await supabase
        .from('shifts')
        .select('*')
        .eq('id', id)
        .single();

      if (shift) {
        await supabase
          .from('shifts')
          .update({
            filled_count: shift.filled_count + 1,
            status: shift.filled_count + 1 >= shift.seat_count ? 'full' : 'open',
          })
          .eq('id', id);
      }
    }

    res.json({ message: 'Volunteer unassigned successfully' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
