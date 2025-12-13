@echo off
REM Technexus Event Management - Installation Script
REM For Windows systems

echo.
echo ========================================
echo  Technexus Installation Script
echo ========================================
echo.

REM Check if Node.js is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js/npm is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js/npm found. Version:
npm --version
echo.

REM Install backend dependencies
echo [1/2] Installing backend dependencies...
cd backend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    cd ..
    pause
    exit /b 1
)
echo [1/2] Backend dependencies installed successfully!
cd ..
echo.

REM Install frontend dependencies
echo [2/2] Installing frontend dependencies...
cd frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    cd ..
    pause
    exit /b 1
)
echo [2/2] Frontend dependencies installed successfully!
cd ..
echo.

echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Open two terminals
echo   2. Terminal 1: cd backend ^&^& npm run dev
echo   3. Terminal 2: cd frontend ^&^& npm run dev
echo.
echo Then visit: http://localhost:5173
echo.
pause
