import { getSupabase } from '../services/supabase.js';
import { Request, Response } from 'express';

/**
 * POST /tasks - Create micro-task
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, estimated_minutes, assigned_to } = req.body;
    const supabase = getSupabase();

    if (!title || !estimated_minutes || !assigned_to) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newTask = {
      title,
      description: description || '',
      estimated_minutes,
      assigned_to,
      status: 'pending',
      created_by: req.user?.id || '',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * GET /tasks - List tasks with filters and volunteer details
 */
export const listTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status = '', assigned_to = '' } = req.query;
    const supabase = getSupabase();

    let query = supabase
      .from('tasks')
      .select(`
        *,
        assigned_volunteer:assigned_to(id, full_name, email, phone)
      `);

    if (status) query = query.eq('status', status);
    if (assigned_to) query = query.eq('assigned_to', assigned_to);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * PATCH /tasks/:id/complete - Mark task as complete
 */
export const completeTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { proof_photo_url = null, feedback = '' } = req.body;
    const supabase = getSupabase();

    const updateData: Record<string, any> = {
      status: 'completed',
      completed_at: new Date(),
      updated_at: new Date(),
    };

    if (proof_photo_url) updateData.proof_photo_url = proof_photo_url;
    if (feedback) updateData.feedback = feedback;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        assigned_volunteer:assigned_to(id, full_name, email, phone)
      `)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * PATCH /tasks/:id/status - Update task status (pending -> on_process -> completed)
 */
export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const supabase = getSupabase();

    // Validate status
    if (!['pending', 'on_process', 'completed'].includes(status)) {
      res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: pending, on_process, completed',
      });
      return;
    }

    const updateData: Record<string, any> = {
      status,
      updated_at: new Date(),
    };

    // Set completed_at when marking as completed
    if (status === 'completed') {
      updateData.completed_at = new Date();
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        assigned_volunteer:assigned_to(id, full_name, email, phone)
      `)
      .single();

    if (error) throw error;

    if (!data) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
