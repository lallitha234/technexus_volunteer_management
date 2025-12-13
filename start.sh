#!/bin/bash

# 🚀 Technexus Event Management System - Startup Script
# This script starts both frontend and backend servers

set -e

echo "🚀 Starting Technexus Event Management System..."
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo -e "${BLUE}Node version: $(node --version)${NC}"
echo -e "${BLUE}npm version: $(npm --version)${NC}"

# Start backend
echo -e "\n${YELLOW}Starting Backend Server...${NC}"
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found!${NC}"
    echo "Please create .env file with the following variables:"
    echo "  PORT=3000"
    echo "  NODE_ENV=development"
    echo "  DATABASE_URL=your_database_url"
    echo "  JWT_SECRET=your_secret_key"
    echo "  FRONTEND_URL=http://localhost:5173"
    echo "  SUPABASE_URL=your_supabase_url"
    echo "  SUPABASE_SERVICE_KEY=your_service_key"
    echo ""
fi

echo -e "${GREEN}✅ Backend ready${NC}"
npm start &
BACKEND_PID=$!
echo -e "${GREEN}Backend running (PID: $BACKEND_PID)${NC}"

# Wait for backend to start
sleep 2

# Start frontend
echo -e "\n${YELLOW}Starting Frontend Server...${NC}"
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env file not found!${NC}"
    echo "Please create .env file with the following variables:"
    echo "  VITE_SUPABASE_URL=your_supabase_url"
    echo "  VITE_SUPABASE_ANON_KEY=your_anon_key"
    echo ""
fi

echo -e "${GREEN}✅ Frontend ready${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend running (PID: $FRONTEND_PID)${NC}"

# Display startup information
echo -e "\n${GREEN}=================================================="
echo "✅ System Started Successfully!"
echo "=================================================${NC}"
echo ""
echo -e "${BLUE}Backend Server:${NC}  http://localhost:3000"
echo -e "${BLUE}Frontend Server:${NC} http://localhost:5173"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for user to press Ctrl+C
trap cleanup INT

cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ All servers stopped${NC}"
    exit 0
}

wait
