# 🚀 Quick Start (5 Minutes)

## TL;DR - Get Running ASAP

### 1️⃣ Supabase (2 minutes)
```bash
1. Go to supabase.com → Create account → Create project
2. Copy Project URL and Service Role Key (Settings → API)
3. Open SQL Editor → New Query
4. Paste entire database/schema.sql
5. Click Execute
```

### 2️⃣ Backend (1 minute)
```bash
cd backend
npm install
cp .env.example .env
nano .env  # Paste your Supabase credentials
npm run dev
```

**Backend running on http://localhost:3000 ✅**

### 3️⃣ Frontend (1 minute)
```bash
cd frontend
npm install
cp .env.example .env
nano .env  # Paste Supabase URL, Anon Key, API URL
npm run dev
```

**Frontend running on http://localhost:5173 ✅**

### 4️⃣ Create Admin User (1 minute)

In Supabase Dashboard:
1. Go to **Authentication → Users**
2. Click **Create new user**
3. Email: `admin@example.com`
4. Password: `password`
5. Check **Auto Confirm User**
6. Create user

### 5️⃣ Login!
```
Visit http://localhost:5173
Login with:
- Email: admin@example.com
- Password: password
```

---

## What You Can Do Right Now

✅ View Dashboard with analytics  
✅ Add/edit/delete volunteers  
✅ Create events  
✅ Manage shifts  
✅ Assign volunteers  
✅ Send messages  
✅ Export data  
✅ View audit logs  

---

## Stuck?

**CORS error?**  
→ Check `FRONTEND_URL` in backend `.env`

**Auth failing?**  
→ Verify admin user exists in Supabase Auth

**Can't connect to database?**  
→ Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct

**More help?**  
→ See SETUP.md for detailed instructions

---

## Environment Variables

### Backend `.env`
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

### Frontend `.env`
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_API_URL=http://localhost:3000/api
```

---

## Demo Data

After login, try:
1. **Add a volunteer** → Click "Add Volunteer" button
2. **Create an event** → Go to Events → Click "New Event"
3. **Create a shift** → View event → Add shifts
4. **Assign volunteer** → View shift → Assign button
5. **View analytics** → Dashboard shows live KPIs

---

## Next Steps

1. **Customize colors** - Edit `frontend/tailwind.config.js`
2. **Update logo** - Replace emoji in Header.tsx
3. **Add your data** - Use the app to manage volunteers
4. **Deploy** - Push to GitHub + Vercel (see SETUP.md)

---

## File Guide

| File | Purpose |
|------|---------|
| `database/schema.sql` | Database tables & policies |
| `backend/src/server.ts` | Express app entry point |
| `frontend/src/App.tsx` | React router & main app |
| `.env.example` | Environment variable template |
| `SETUP.md` | Detailed setup guide |
| `API.md` | API endpoint documentation |
| `GUIDE.md` | Architecture & development guide |

---

## Tech Stack (TL;DR)

- **Frontend:** React + TypeScript + Tailwind
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth + JWT
- **Deploy:** Vercel

---

## Support

- **Issues?** Check SETUP.md
- **How does API work?** Check API.md
- **Architecture questions?** Check GUIDE.md
- **Supabase help?** See supabase.com/docs

---

**You're ready to go! 🎉**

Open both terminals, login, and start managing volunteers!
