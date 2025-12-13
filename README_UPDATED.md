# 🎪 Technexus Event Management System

## ✨ Complete Admin Volunteer & Event Management Platform

A production-ready, full-featured admin dashboard for managing volunteers, events, tasks, and communications.

---

## 🎯 Features at a Glance

### Admin Features
- ✅ **Volunteer Management** - Create, edit, delete, search, filter
- ✅ **Event Management** - Plan, publish, track, and manage events
- ✅ **Task Management** - Assign tasks and track completion
- ✅ **Communication** - Send broadcasts and manage notifications
- ✅ **Analytics Dashboard** - Real-time KPIs and metrics
- ✅ **Admin Settings** - System configuration and audit logs
- ✅ **Security** - JWT auth, role-based access, audit trail

### Technical Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js + TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth + JWT
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build**: Vite

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js v18+
- npm or yarn
- Supabase account (free)

### 1. Clone & Install
```bash
git clone <repo-url>
cd technexus_event_management

# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

### 2. Configure Environment

**Backend (`backend/.env`):**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Servers

```bash
# Windows
start.bat

# Unix/Mac
./start.sh

# Manual
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 4. Access Application
- **Admin Dashboard**: http://localhost:5173/dashboard
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

**Default Admin Login:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ Change credentials in production!

---

## 📋 Complete Feature List

### Volunteer Management (10+ features)
- ✅ View volunteers with pagination
- ✅ Create new volunteers
- ✅ Edit volunteer details
- ✅ Delete volunteers (soft delete)
- ✅ Search by name/email
- ✅ Filter by status
- ✅ Assign badges
- ✅ Track hours
- ✅ Export lists
- ✅ Admin notes

### Event Management (8+ features)
- ✅ Create events
- ✅ Edit events
- ✅ Publish/cancel
- ✅ Assign volunteers
- ✅ Track status
- ✅ Set slots
- ✅ Manage assignments
- ✅ Event history

### Additional Features
- ✅ Task management
- ✅ Broadcasting
- ✅ Analytics dashboard
- ✅ Admin settings
- ✅ Audit logs
- ✅ Security hardened

---

## 📚 Documentation

Start with these in order:

1. **ENVIRONMENT_SETUP.md** ← Start here! (Complete setup guide)
2. **DEPLOYMENT_GUIDE.md** (Production deployment)
3. **FEATURES_CHECKLIST.md** (All features listed)
4. **TESTING_VOLUNTEERS.md** (Test scenarios)

---

## 🔐 Security

- ✅ JWT authentication
- ✅ Role-based access
- ✅ Helmet.js headers
- ✅ CORS configured
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Audit logging
- ✅ Soft delete
- ✅ Row-level security

---

## 📊 Database

9 fully configured tables:
- volunteers
- events
- tasks
- messages
- volunteer_badges
- event_assignments
- task_assignments
- audit_logs
- shifts

With indexes and relationships. See `FEATURES_CHECKLIST.md` for schema.

---

## 🔗 API Endpoints

All endpoints protected and fully functional:
- `/api/volunteers` - Volunteer CRUD
- `/api/events` - Event CRUD
- `/api/tasks` - Task management
- `/api/messages` - Communication
- `/api/analytics` - Dashboard stats
- `/api/export` - Data export

---

## 🛠️ Development

```bash
# Run both servers
cd backend && npm start
cd frontend && npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

---

## 📦 Project Structure

```
technexus_event_management/
├── frontend/          (React app - 11 pages, 6 components)
├── backend/           (Express API - 7 routes, full CRUD)
└── Documentation/     (10+ guides)
```

---

## 🚀 Ready to Deploy!

✅ All features implemented
✅ All endpoints working
✅ Database configured
✅ Security hardened
✅ Documentation complete
✅ Zero errors

**Status: PRODUCTION READY** 🎉

---

**👉 Next Step: Read `ENVIRONMENT_SETUP.md` to get started!**

