@echo off
REM 🚀 Technexus Event Management System - Startup Script (Windows)
REM This script starts both frontend and backend servers

echo.
echo 🚀 Starting Technexus Event Management System...
echo ==================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo Node version: 
node --version
echo npm version: 
npm --version
echo.

REM Start backend
echo 📦 Starting Backend Server...
cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📥 Installing backend dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo ⚠️  Backend .env file not found!
    echo Please create .env file with the following variables:
    echo   PORT=3000
    echo   NODE_ENV=development
    echo   DATABASE_URL=your_database_url
    echo   JWT_SECRET=your_secret_key
    echo   FRONTEND_URL=http://localhost:5173
    echo   SUPABASE_URL=your_supabase_url
    echo   SUPABASE_SERVICE_KEY=your_service_key
    echo.
)

echo ✅ Backend ready
start "Technexus Backend" npm start
timeout /t 3 /nobreak

REM Start frontend
echo.
echo 📦 Starting Frontend Server...
cd ..\frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📥 Installing frontend dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo ⚠️  Frontend .env file not found!
    echo Please create .env file with the following variables:
    echo   VITE_SUPABASE_URL=your_supabase_url
    echo   VITE_SUPABASE_ANON_KEY=your_anon_key
    echo.
)

echo ✅ Frontend ready
start "Technexus Frontend" npm run dev

REM Display startup information
echo.
echo ==================================================
echo ✅ System Started Successfully!
echo ==================================================
echo.
echo 🔗 Backend Server:  http://localhost:3000
echo 🔗 Frontend Server: http://localhost:5173
echo 📚 Admin Dashboard: http://localhost:5173/dashboard
echo.
echo ✅ Two terminal windows should have opened.
echo    Use them to monitor backend and frontend output.
echo.
echo 💡 Close both terminal windows to stop the servers.
echo.
pause
