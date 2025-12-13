# Quick Fix - HTTP 404 Error

## ⚡ Immediate Actions (Do These First)

### 1️⃣ Create Backend .env File

Create file: `backend/.env`

```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_JWT_SECRET=your-jwt-secret
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 2️⃣ Create Frontend .env File

Create file: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3️⃣ Stop All Servers

If servers are running, stop them (Ctrl+C).

### 4️⃣ Restart Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5️⃣ Test

1. Go to http://localhost:5173
2. Login with: admin@example.com / admin123456
3. Go to Volunteers → New Volunteer
4. Try creating a volunteer

## ❌ What NOT to Do

- ❌ Don't hardcode credentials in code
- ❌ Don't commit .env files to Git
- ❌ Don't use localhost:3000 in production
- ❌ Don't skip the environment variables setup

## ✅ Success Signs

- ✅ Backend shows: "🚀 Server running on http://localhost:3000"
- ✅ Frontend shows: "Local: http://localhost:5173/"
- ✅ New Volunteer page loads (no HTTP 404)
- ✅ Form submits and creates volunteer
- ✅ Volunteer appears in list

## 🔧 Troubleshooting

**Backend won't start?**
- Check Node.js version: `node --version` (needs v18+)
- Check npm: `npm --version` (needs v9+)
- Delete node_modules and reinstall: `npm install`

**Still getting 404?**
- Check browser console for error details
- Check backend terminal for error logs
- Verify .env files have correct values

**Can't login?**
- Verify Supabase credentials in .env
- Check database exists and has auth setup

For detailed help, see: `FIX_HTTP_404.md`
