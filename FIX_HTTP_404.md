# Fix HTTP 404 Error on New Volunteer Page

## Problem
Getting "HTTP 404" error when trying to access `/volunteers/new` or create a volunteer.

## Root Causes
1. Backend server not running
2. Missing or incorrectly configured environment variables
3. Authentication/JWT token issues
4. CORS configuration problem

## Solution

### Step 1: Configure Environment Variables

Create `.env` file in the `backend` folder with these variables:

```env
# Required Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=super-secret-jwt-token-from-supabase

# Optional
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Create `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **API**
4. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **Service Key** → `SUPABASE_SERVICE_ROLE_KEY`
   - **JWT Secret** → `SUPABASE_JWT_SECRET`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`

### Step 3: Start Backend Server

```bash
cd backend

# Install dependencies if needed
npm install

# Start the server
npm start
```

**Expected output:**
```
✅ Supabase initialized
🚀 Server running on http://localhost:3000
```

### Step 4: Start Frontend Server (New Terminal)

```bash
cd frontend

# Install dependencies if needed
npm install

# Start dev server
npm run dev
```

**Expected output:**
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

### Step 5: Test the Application

1. Go to http://localhost:5173/
2. You should see the Technexus logo and login page
3. Login with:
   - Email: `admin@example.com`
   - Password: `admin123456`
4. Navigate to: Volunteers → New Volunteer
5. Form should load without errors
6. Fill in the form and submit

## Verification Checklist

- [ ] Backend server running on http://localhost:3000
- [ ] Frontend running on http://localhost:5173
- [ ] `.env` files created in both `backend` and `frontend` folders
- [ ] Supabase credentials configured
- [ ] Can login to the application
- [ ] New Volunteer page loads without HTTP 404 error
- [ ] Can create a new volunteer

## Troubleshooting

### Still Getting HTTP 404?

**Check Backend Logs:**
```
Look for these messages:
✅ Supabase initialized
🚀 Server running on http://localhost:3000
```

If you see errors, it's likely a Supabase credential issue.

**Check Network Request:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Fill the form and click Create
4. Look for the POST request to `http://localhost:3000/api/volunteers`
5. Check the response - it should show the actual error

**Common Errors:**

| Error | Solution |
|-------|----------|
| "SUPABASE_URL: ✗ Missing" | Add SUPABASE_URL to backend/.env |
| "SUPABASE_SERVICE_ROLE_KEY: ✗ Missing" | Add SUPABASE_SERVICE_ROLE_KEY to backend/.env |
| Cannot POST /api/volunteers | Backend server not running |
| 401 Unauthorized | Invalid JWT token or missing SUPABASE_JWT_SECRET |
| 403 Forbidden | User doesn't have admin role |

### Check Server Health

```bash
# While server is running, test in another terminal:
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-12-13T..."}
```

## File Structure

Make sure your project structure looks like this:

```
technexus_event_management/
├── backend/
│   ├── .env                 ← Create this file
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   └── volunteers.ts
│   │   ├── controllers/
│   │   │   └── volunteers.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── services/
│   │   │   └── supabase.ts
│   │   └── utils/
│   │       └── auth.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── .env                 ← Create this file
│   ├── src/
│   │   ├── pages/
│   │   │   └── NewVolunteerPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── supabase.ts
│   │   └── store/
│   │       └── authStore.ts
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Next Steps

After fixing the HTTP 404 error:

1. ✅ Test volunteer creation
2. ✅ Test volunteer listing
3. ✅ Test volunteer editing
4. ✅ Test volunteer deletion
5. ✅ Test other admin features

If you still encounter issues, please:
1. Check the browser console (F12) for error messages
2. Check the backend terminal for server logs
3. Verify all environment variables are correctly set

