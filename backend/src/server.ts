/* eslint-disable no-console */
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initSupabase } from './services/supabase.js';
import { errorHandler } from './middleware/auth.js';

// Routes
import authRoutes from './routes/auth.js';
import volunteersRoutes from './routes/volunteers.js';
import eventsRoutes from './routes/events.js';
import tasksRoutes from './routes/tasks.js';
import messagesRoutes from './routes/messages.js';
import analyticsRoutes from './routes/analytics.js';
import exportRoutes from './routes/export.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
try {
  initSupabase();
  console.log('✅ Supabase initialized');
} catch (error) {
  console.error('❌ Failed to initialize Supabase:', error);
  process.exit(1);
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Request logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  console.log(`[${new Date().toISOString()}] ${req.method.padEnd(6)} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test endpoint to verify routing
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
