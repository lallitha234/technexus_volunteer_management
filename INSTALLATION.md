# Technexus Event Management - Installation Guide

## Quick Installation

### Option 1: Using npm (Recommended)

#### Backend Installation
```bash
cd backend
npm install
```

#### Frontend Installation
```bash
cd frontend
npm install
```

---

## Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
npm run build    # Compile TypeScript
npm run dev      # Start development server
```

**What gets installed:**
- Express.js server framework
- Supabase client
- JWT authentication
- CORS & Helmet security
- TypeScript & build tools
- Development utilities (tsx, eslint, prettier)

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev      # Start development server on http://localhost:5173
```

**What gets installed:**
- React 18
- React Router v6
- Zustand state management
- Supabase client
- Tailwind CSS
- Vite build tool
- Development utilities

### 3. Environment Variables

Create `.env` files in both directories:

**backend/.env**
```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

**frontend/.env**
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000
```

---

## Troubleshooting

### If npm install fails:

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and lock file**
   ```bash
   rm -r node_modules package-lock.json
   npm install
   ```

3. **Use legacy peer deps flag**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Check Node.js version**
   ```bash
   node --version  # Should be 18+ 
   npm --version   # Should be 9+
   ```

---

## Development Commands

### Backend
- `npm run dev` - Start dev server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled server
- `npm run lint` - Check code quality
- `npm run format` - Auto-format code

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run format` - Auto-format code

---

## Verify Installation

### Backend
```bash
cd backend
npm run build  # Should compile without errors
```

### Frontend
```bash
cd frontend
npm run build  # Should build without errors
```

---

## Total Package Counts

**Backend:** 18 dependencies (7 prod + 11 dev)
**Frontend:** 19 dependencies (6 prod + 13 dev)

All packages are pinned to specific versions for stability.
