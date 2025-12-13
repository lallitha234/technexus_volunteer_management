#!/usr/bin/env pwsh

Write-Host "🚀 Installing Technexus Event Management dependencies..." -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "$root\backend"
npm install
Write-Host "✅ Backend packages installed" -ForegroundColor Green

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "$root\frontend"
npm install
Write-Host "✅ Frontend packages installed" -ForegroundColor Green

Write-Host "`n✨ Installation complete!" -ForegroundColor Green
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Backend:  cd backend && npm run dev"
Write-Host "  2. Frontend: cd frontend && npm run dev"
