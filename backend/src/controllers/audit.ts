/* eslint-disable no-console */
import { getSupabase } from '../services/supabase.js';
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Log all admin actions for compliance and auditing
 */
export const logAudit = async (
  admin_id: string,
  action: string,
  resource_type: string,
  resource_id: string,
  old_values: Record<string, any>,
  new_values: Record<string, any>,
  ip_address?: string
): Promise<void> => {
  try {
    const supabase = getSupabase();

    await supabase.from('audit_logs').insert([
      {
        admin_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        ip_address: ip_address || 'unknown',
        created_at: new Date(),
      },
    ]);
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
};

/**
 * Get audit logs (admin-only)
 */
export const getAuditLogs = async (
  limit = 100,
  offset = 0
): Promise<Record<string, any>[] | null> => {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return null;
  }
};
