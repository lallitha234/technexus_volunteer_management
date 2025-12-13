import { getSupabase } from '../services/supabase.js';
import { Request, Response } from 'express';

/**
 * GET /analytics/summary - Get dashboard analytics
 */
export const getAnalyticsSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();

    // Total volunteers
    const { count: totalVolunteersCount } = await supabase
      .from('volunteers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .then(res => ({ count: res.count || 0 }));

    // Active volunteers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: activeVolunteersCount } = await supabase
      .from('volunteers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('last_active_at', thirtyDaysAgo.toISOString())
      .then(res => ({ count: res.count || 0 }));

    // Upcoming events (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { count: upcomingEventsCount } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('start_at', now.toISOString())
      .lte('start_at', thirtyDaysFromNow.toISOString())
      .then(res => ({ count: res.count || 0 }));

    // Total hours
    const { data: allVolunteers } = await supabase
      .from('volunteers')
      .select('total_hours');

    const totalHours = allVolunteers?.reduce((sum: number, v: any) => sum + (v.total_hours || 0), 0) || 0;

    // Event fill rate
    const { data: shifts } = await supabase
      .from('shifts')
      .select('filled_count, seat_count');

    let totalSeats = 0;
    let filledSeats = 0;

    if (shifts) {
      shifts.forEach((shift: any) => {
        totalSeats += shift.seat_count || 0;
        filledSeats += shift.filled_count || 0;
      });
    }

    const fillRate = totalSeats > 0 ? (filledSeats / totalSeats) * 100 : 0;

    // No-show rate
    const { data: assignments } = await supabase
      .from('shift_assignments')
      .select('status')
      .in('status', ['completed', 'no_show']);

    let noShowCount = 0;
    let totalAssignments = 0;

    if (assignments) {
      totalAssignments = assignments.length;
      noShowCount = assignments.filter((a: any) => a.status === 'no_show').length;
    }

    const noShowRate = totalAssignments > 0 ? (noShowCount / totalAssignments) * 100 : 0;

    res.json({
      total_volunteers: totalVolunteersCount,
      active_volunteers: activeVolunteersCount,
      upcoming_events: upcomingEventsCount,
      total_hours_contributed: totalHours,
      event_fill_rate: Math.round(fillRate * 100) / 100,
      no_show_rate: Math.round(noShowRate * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * GET /export/volunteers - Export volunteers as CSV
 */
export const exportVolunteers = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    // Convert to CSV
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Skills',
      'Total Hours',
      'Total Events',
      'Created At',
    ];

    const rows = data.map((v: any) => [
      v.id,
      v.full_name,
      v.email,
      v.phone || '',
      (v.skills || []).join('; '),
      v.total_hours,
      v.total_events,
      new Date(v.created_at).toISOString().split('T')[0],
    ]);

    const csv = [headers, ...rows].map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=volunteers.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * GET /export/attendance - Export attendance report as CSV
 */
export const exportAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('shift_assignments')
      .select('*, shifts(role_name, start_at), volunteers(full_name, email)')
      .in('status', ['completed', 'no_show']);

    if (error) throw error;

    const headers = ['Volunteer Name', 'Email', 'Role', 'Shift Date', 'Status', 'Hours Worked'];

    const rows = data.map((a: any) => [
      a.volunteers?.full_name || 'N/A',
      a.volunteers?.email || 'N/A',
      a.shifts?.role_name || 'N/A',
      new Date(a.shifts?.start_at || '').toISOString().split('T')[0],
      a.status,
      a.hours_worked || 0,
    ]);

    const csv = [headers, ...rows].map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
