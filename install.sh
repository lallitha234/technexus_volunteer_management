#!/bin/bash

# Technexus Event Management - Installation Script
# For macOS and Linux systems

echo ""
echo "========================================"
echo "  Technexus Installation Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: Node.js/npm is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js/npm found. Version:"
npm --version
echo ""

# Install backend dependencies
echo "[1/2] Installing backend dependencies..."
cd backend
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "ERROR: Backend installation failed!"
    cd ..
    exit 1
fi
echo "[1/2] Backend dependencies installed successfully!"
cd ..
echo ""

# Install frontend dependencies
echo "[2/2] Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend installation failed!"
    cd ..
    exit 1
fi
echo "[2/2] Frontend dependencies installed successfully!"
cd ..
echo ""

echo "========================================"
echo "  Installation Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Open two terminals"
echo "  2. Terminal 1: cd backend && npm run dev"
echo "  3. Terminal 2: cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
echo ""
