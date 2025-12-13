# Setup Instructions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free at supabase.com)
- Vercel account (optional, for deployment)

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Service Role Key** (in Settings → API)
3. Go to **SQL Editor** and create new query
4. Copy the entire contents of `database/schema.sql`
5. Paste and execute the query
6. Tables, policies, and seed badges are created automatically

## Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env` with your Supabase credentials:**

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key-from-settings
SUPABASE_JWT_SECRET=your-jwt-secret-from-settings
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

**Get your JWT Secret:**
1. In Supabase dashboard, go to Settings → API
2. Under JWT Secret, copy the `your-super-secret-jwt-token-with-at-least-32-characters-long` value

**Start the backend:**

```bash
npm run dev
# Server runs on http://localhost:3000
```

You should see: `🚀 Server running on http://localhost:3000`

## Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env` with Supabase credentials:**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-settings
VITE_API_URL=http://localhost:3000/api
```

**Get your Anon Key:**
1. In Supabase dashboard, go to Settings → API
2. Copy the **Anon public** key

**Start the frontend:**

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

## Step 4: Create Admin User

You need to create an admin account in Supabase:

1. Go to Supabase dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Create new user** button
4. Fill in:
   - Email: `admin@example.com` (or any email)
   - Password: `password` (or any password)
   - Tick "Auto confirm user"
5. Click **Create user**

**Now login:**
- Go to `http://localhost:5173/login`
- Email: `admin@example.com`
- Password: `password` (whatever you set)
- Click "Sign In as Admin"

You should be redirected to the dashboard! 🎉

## Troubleshooting Setup

### Port already in use?
- Backend default is 3000, frontend is 5173
- Change PORT in backend `.env` if needed
- Update VITE_API_URL in frontend accordingly

### CORS errors when loading data?
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend is running (http://localhost:3000/health should return `{"status":"ok"}`

### Auth fails with "Invalid credentials"?
- Verify user exists in Supabase Authentication
- Check that email/password are correct
- Ensure user is auto-confirmed in Supabase

### Supabase connection error?
- Verify `SUPABASE_URL` is correct (https://xxxx.supabase.co)
- Check that `SUPABASE_SERVICE_ROLE_KEY` is the full key (very long string)
- Ensure you're using **Service Role Key**, not Anon key, for backend

### Still having issues?
- Clear browser cache and hard reload (Ctrl+Shift+R)
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check browser console (F12) for specific error messages
- Check terminal where backend is running for logs

## Next Steps

- ✅ Explore the Dashboard
- ✅ Add your first volunteer
- ✅ Create an event
- ✅ Assign volunteers to shifts
- ✅ Review audit logs

Enjoy! 🎪✨
