-- Technexus Event Management - Supabase Schema
-- Production-ready schema with RLS policies

-- ============================================
-- VOLUNTEERS TABLE
-- ============================================
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  pronouns VARCHAR(50),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  photo_url TEXT,
  bio TEXT,
  admin_notes TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  availability_weekdays TEXT[] DEFAULT '{}', -- ["Monday", "Tuesday", ...]
  availability_time_slots TEXT[] DEFAULT '{}', -- ["9-12", "12-17", "17-21"]
  consent_contact BOOLEAN DEFAULT true,
  consent_photo BOOLEAN DEFAULT false,
  total_hours DECIMAL(10, 2) DEFAULT 0,
  total_events INT DEFAULT 0,
  no_show_count INT DEFAULT 0,
  last_active_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, archived
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE INDEX idx_volunteers_email ON volunteers(email);
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_created_at ON volunteers(created_at);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  tags TEXT[] DEFAULT '{}',
  start_at TIMESTAMP NOT NULL,
  end_at TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, cancelled, completed
  published_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  estimated_volunteers INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL,
  FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_created_by ON events(created_by);

-- ============================================
-- SHIFTS TABLE
-- ============================================
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  role_name VARCHAR(255) NOT NULL,
  description TEXT,
  required_skills TEXT[] DEFAULT '{}',
  start_at TIMESTAMP NOT NULL,
  end_at TIMESTAMP NOT NULL,
  seat_count INT NOT NULL DEFAULT 1,
  filled_count INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'open', -- open, full, cancelled, completed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX idx_shifts_event_id ON shifts(event_id);
CREATE INDEX idx_shifts_status ON shifts(status);

-- ============================================
-- SHIFT ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE shift_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id UUID NOT NULL,
  volunteer_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'assigned', -- assigned, completed, no_show, cancelled, waitlist
  hours_worked DECIMAL(10, 2),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
  UNIQUE(shift_id, volunteer_id)
);

CREATE INDEX idx_shift_assignments_volunteer_id ON shift_assignments(volunteer_id);
CREATE INDEX idx_shift_assignments_status ON shift_assignments(status);

-- ============================================
-- TASKS (MICRO-GIGS) TABLE
-- ============================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_minutes INT NOT NULL,
  assigned_to UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled
  proof_photo_url TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL,
  FOREIGN KEY (assigned_to) REFERENCES volunteers(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  emoji VARCHAR(10),
  icon_url TEXT,
  criteria VARCHAR(50) DEFAULT 'manual', -- manual, hours, events, streak
  criteria_value INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- VOLUNTEER BADGES TABLE
-- ============================================
CREATE TABLE volunteer_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL,
  badge_id UUID NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE(volunteer_id, badge_id)
);

CREATE INDEX idx_volunteer_badges_volunteer_id ON volunteer_badges(volunteer_id);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_admin UUID NOT NULL,
  to_volunteer_id UUID,
  broadcast_filter JSONB, -- Null for 1-to-1, contains filter criteria for broadcast
  subject VARCHAR(255),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'manual', -- manual, template, auto
  template_key VARCHAR(100),
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (from_admin) REFERENCES auth.users(id),
  FOREIGN KEY (to_volunteer_id) REFERENCES volunteers(id) ON DELETE SET NULL
);

CREATE INDEX idx_messages_to_volunteer_id ON messages(to_volunteer_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (admin_id) REFERENCES auth.users(id)
);

CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- ============================================
-- ANALYTICS SUMMARY (Materialized view)
-- ============================================
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key VARCHAR(100) NOT NULL UNIQUE,
  metric_value INT,
  calculated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (Admin-only access)
-- ============================================

-- Volunteers: Admins can do all, volunteers can only view own profile (when that feature is added)
CREATE POLICY "Admins can view all volunteers" ON volunteers
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can insert volunteers" ON volunteers
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update volunteers" ON volunteers
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete volunteers" ON volunteers
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Events: Admin-only
CREATE POLICY "Admins can view all events" ON events
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can create events" ON events
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update events" ON events
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete events" ON events
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Shifts: Admin-only
CREATE POLICY "Admins can view all shifts" ON shifts
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage shifts" ON shifts
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update shifts" ON shifts
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete shifts" ON shifts
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Shift Assignments: Admin-only
CREATE POLICY "Admins can manage shift assignments" ON shift_assignments
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can assign to shifts" ON shift_assignments
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update assignments" ON shift_assignments
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete assignments" ON shift_assignments
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Tasks: Admin-only
CREATE POLICY "Admins can manage tasks" ON tasks
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update tasks" ON tasks
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete tasks" ON tasks
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Volunteer Badges: Admin-only
CREATE POLICY "Admins can manage volunteer badges" ON volunteer_badges
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can award badges" ON volunteer_badges
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update badges" ON volunteer_badges
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can revoke badges" ON volunteer_badges
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Messages: Admin-only
CREATE POLICY "Admins can manage messages" ON messages
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can send messages" ON messages
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update messages" ON messages
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete messages" ON messages
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Badges: Admin-only
CREATE POLICY "Admins can manage badges" ON badges
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can create badges" ON badges
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update badges" ON badges
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete badges" ON badges
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Audit Logs: Admin-only
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Analytics Cache: Admin-only
CREATE POLICY "Admins can view analytics cache" ON analytics_cache
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can update analytics cache" ON analytics_cache
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update analytics" ON analytics_cache
  FOR UPDATE WITH CHECK (true);

-- ============================================
-- INITIAL SEED DATA (BADGES)
-- ============================================
INSERT INTO badges (name, description, emoji, criteria, criteria_value) VALUES
  ('First Shift', 'Completed your first shift 🎉', '🎪', 'events', 1),
  ('Volunteer Champion', 'Completed 10 events', '⭐', 'events', 10),
  ('Hour Master', 'Contributed 100+ hours', '⏰', 'hours', 100),
  ('Team Player', 'No-show rate below 5%', '🤝', 'manual', null),
  ('Rising Star', 'Active volunteer (last 30 days)', '✨', 'manual', null),
  ('Skill Builder', 'Mastered 3+ skills', '🛠️', 'manual', null);
