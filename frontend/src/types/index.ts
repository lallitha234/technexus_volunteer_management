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
  last_active_at?: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  tags: string[];
  start_at: string;
  end_at: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  published_at?: string;
  cancelled_at?: string;
  estimated_volunteers?: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Shift {
  id: string;
  event_id: string;
  role_name: string;
  description?: string;
  required_skills: string[];
  start_at: string;
  end_at: string;
  seat_count: number;
  filled_count: number;
  status: 'open' | 'full' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ShiftAssignment {
  id: string;
  shift_id: string;
  volunteer_id: string;
  status: 'assigned' | 'completed' | 'no_show' | 'cancelled' | 'waitlist';
  hours_worked?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimated_minutes?: number;
  assigned_to?: string;
  due_at?: string;
  priority?: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'cancelled';
  proof_photo_url?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Message {
  id: string;
  from_admin?: string;
  title?: string;
  body?: string;
  to_volunteer_id?: string;
  broadcast_filter?: Record<string, any>;
  sent_to_all?: boolean;
  subject?: string;
  content?: string;
  message_type?: 'manual' | 'template' | 'auto';
  template_key?: string;
  delivered_at?: string;
  read_at?: string;
  created_at: string;
  created_by?: string;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  icon_url?: string;
  criteria: 'manual' | 'hours' | 'events' | 'streak';
  criteria_value?: number;
  created_at: string;
}

export interface AnalyticsSummary {
  total_volunteers: number;
  active_volunteers: number;
  upcoming_events: number;
  total_hours_contributed: number;
  event_fill_rate: number;
  no_show_rate: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'volunteer';
}
