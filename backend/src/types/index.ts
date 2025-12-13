// Backend type definitions
export interface Volunteer {
  id: string;
  full_name: string;
  display_name?: string;
  pronouns?: string;
  email: string;
  phone?: string;
  photo_url?: string;
  bio?: string;
  admin_notes?: string;
  skills: string[];
  interests: string[];
  availability_weekdays: string[];
  availability_time_slots: string[];
  consent_contact: boolean;
  consent_photo: boolean;
  total_hours: number;
  total_events: number;
  no_show_count: number;
  last_active_at?: Date;
  status: 'active' | 'inactive' | 'archived';
  created_at: Date;
  updated_at: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  tags: string[];
  start_at: Date;
  end_at: Date;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  published_at?: Date;
  cancelled_at?: Date;
  estimated_volunteers?: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

export interface Shift {
  id: string;
  event_id: string;
  role_name: string;
  description?: string;
  required_skills: string[];
  start_at: Date;
  end_at: Date;
  seat_count: number;
  filled_count: number;
  status: 'open' | 'full' | 'cancelled' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface ShiftAssignment {
  id: string;
  shift_id: string;
  volunteer_id: string;
  status: 'assigned' | 'completed' | 'no_show' | 'cancelled' | 'waitlist';
  hours_worked?: number;
  feedback?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimated_minutes: number;
  assigned_to: string;
  status: 'pending' | 'completed' | 'cancelled';
  proof_photo_url?: string;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

export interface Message {
  id: string;
  from_admin: string;
  to_volunteer_id?: string;
  broadcast_filter?: Record<string, any>;
  subject?: string;
  content: string;
  message_type: 'manual' | 'template' | 'auto';
  template_key?: string;
  delivered_at?: Date;
  read_at?: Date;
  created_at: Date;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  icon_url?: string;
  criteria: 'manual' | 'hours' | 'events' | 'streak';
  criteria_value?: number;
  created_at: Date;
}

export interface VolunteerBadge {
  id: string;
  volunteer_id: string;
  badge_id: string;
  earned_at: Date;
  created_at: Date;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'volunteer';
  aud?: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AnalyticsSummary {
  total_volunteers: number;
  active_volunteers: number;
  upcoming_events: number;
  total_hours_contributed: number;
  event_fill_rate: number;
  no_show_rate: number;
}
