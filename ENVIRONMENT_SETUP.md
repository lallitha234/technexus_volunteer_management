# 🔧 Environment Setup Guide

## Quick Setup (5 minutes)

### 1. Backend Setup

**Create `backend/.env`:**
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/technexus_db

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters-long-here

# Frontend
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here
```

**Install & Run:**
```bash
cd backend
npm install
npm start
```

Expected output:
```
✅ Supabase initialized
🚀 Server running on http://localhost:3000
📝 Environment: development
```

---

### 2. Frontend Setup

**Create `frontend/.env`:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Install & Run:**
```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
VITE v4.x.x  build 0.00s

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## Detailed Setup Instructions

### Step 1: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Create new project
4. Wait for initialization (2-3 minutes)
5. Go to Settings → API
6. Copy:
   - **Project URL** → `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`
   - **Service Key** → `SUPABASE_SERVICE_KEY`

### Step 2: Create Database Tables

Run these SQL queries in Supabase SQL Editor:

```sql
-- Volunteers
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  pronouns VARCHAR(50),
  display_name VARCHAR(255),
  bio TEXT,
  admin_notes TEXT,
  photo_url VARCHAR(500),
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  availability_weekdays TEXT[] DEFAULT '{}',
  availability_time_slots TEXT[] DEFAULT '{}',
  consent_contact BOOLEAN DEFAULT false,
  consent_photo BOOLEAN DEFAULT false,
  total_hours NUMERIC DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  no_show_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location_address VARCHAR(500),
  location_lat NUMERIC,
  location_lng NUMERIC,
  event_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  event_type VARCHAR(100),
  total_volunteers_needed INTEGER,
  assigned_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES volunteers(id),
  assigned_by UUID,
  event_id UUID REFERENCES events(id),
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID,
  recipient_id UUID REFERENCES volunteers(id),
  title VARCHAR(255),
  content TEXT NOT NULL,
  message_type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Volunteer Badges
CREATE TABLE volunteer_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID REFERENCES volunteers(id),
  badge_type VARCHAR(100),
  earned_at TIMESTAMP DEFAULT NOW()
);

-- Event Assignments
CREATE TABLE event_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  volunteer_id UUID REFERENCES volunteers(id),
  status VARCHAR(50) DEFAULT 'assigned',
  hours_contributed NUMERIC DEFAULT 0,
  assigned_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  UNIQUE(event_id, volunteer_id)
);

-- Task Assignments
CREATE TABLE task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  volunteer_id UUID REFERENCES volunteers(id),
  status VARCHAR(50) DEFAULT 'pending',
  completed_at TIMESTAMP,
  UNIQUE(task_id, volunteer_id)
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action VARCHAR(50),
  entity_type VARCHAR(100),
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shifts
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID REFERENCES volunteers(id),
  event_id UUID REFERENCES events(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_email ON volunteers(email);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_event_assignments_event_id ON event_assignments(event_id);
CREATE INDEX idx_event_assignments_volunteer_id ON event_assignments(volunteer_id);
```

### Step 3: Enable Row-Level Security

In Supabase:
1. Go to Authentication → Users
2. Create test admin user with email and password
3. Enable RLS for all tables (Security → Row Level Security)
4. Create policies:

```sql
-- Allow admins to see all data
CREATE POLICY "Admins can view all" ON volunteers
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all" ON volunteers
USING (auth.role() = 'authenticated');
```

### Step 4: Configure Environment Variables

**Backend `.env`:**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
JWT_SECRET=your-secret-key-minimum-32-characters-required
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

**Frontend `.env`:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 5: Start Development Servers

**Option A: Using startup scripts**

Windows:
```bash
start.bat
```

Unix/Mac:
```bash
chmod +x start.sh
./start.sh
```

**Option B: Manual setup**

Terminal 1 (Backend):
```bash
cd backend
npm install
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm install
npm run dev
```

### Step 6: Access the Application

Open browser and go to:
- **Admin Dashboard**: http://localhost:5173/dashboard
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

---

## Default Admin User

**Email:** admin@example.com  
**Password:** admin123

⚠️ Change this in production!

---

## Troubleshooting

### Port Already in Use

**Backend (Port 3000):**
```bash
# Find process on port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Frontend (Port 5173):**
```bash
# Find process on port 5173
lsof -i :5173
# Kill process
kill -9 <PID>
```

### Database Connection Error

1. Verify `DATABASE_URL` is correct
2. Check PostgreSQL is running
3. Verify credentials
4. Test connection: `psql <DATABASE_URL>`

### Supabase Connection Error

1. Verify `SUPABASE_URL` and keys are correct
2. Check Supabase project is active
3. Verify Supabase JWT secret matches `JWT_SECRET`
4. Check network connectivity

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Install missing types
npm install --save-dev @types/node
```

---

## Environment Variables Reference

### Backend
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| PORT | No | 3000 | Server port |
| NODE_ENV | No | development | Environment |
| DATABASE_URL | Yes | - | PostgreSQL URL |
| JWT_SECRET | Yes | - | JWT signing secret |
| FRONTEND_URL | No | http://localhost:5173 | CORS origin |
| SUPABASE_URL | Yes | - | Supabase API URL |
| SUPABASE_SERVICE_KEY | Yes | - | Supabase service key |

### Frontend
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| VITE_SUPABASE_URL | Yes | - | Supabase API URL |
| VITE_SUPABASE_ANON_KEY | Yes | - | Supabase anon key |

---

## Next Steps

1. ✅ Complete setup above
2. ✅ Start backend server
3. ✅ Start frontend server
4. ✅ Log in with admin credentials
5. ✅ Create test volunteer
6. ✅ Create test event
7. ✅ Assign volunteers to event
8. ✅ Explore all features
9. ✅ Ready for production deployment

---

## Support

- **Backend Issues**: Check `backend/` console logs
- **Frontend Issues**: Check browser DevTools console
- **Database Issues**: Check Supabase logs in dashboard
- **Documentation**: See `DEPLOYMENT_GUIDE.md`

