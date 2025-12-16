import React, { useEffect, useState } from 'react';
import { DashboardStats } from '../components/DashboardStats.js';
import { analyticsApi } from '../services/api.js';
import { AnalyticsSummary } from '../types/index.js';
import { RefreshCw, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRefresh } from '../context/RefreshContext.js';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshDashboard } = useRefresh();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyticsApi.summary();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Listen for refresh triggers
  useEffect(() => {
    const handleRefresh = () => {
      fetchAnalytics();
    };
    
    // Create a custom event listener
    window.addEventListener('dashboardRefresh', handleRefresh);
    return () => window.removeEventListener('dashboardRefresh', handleRefresh);
  }, []);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">📊 Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here's your volunteer management overview.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="btn-secondary flex items-center gap-2 text-sm"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="card p-4 bg-red-500/10 border border-red-500/30">
          <div className="flex items-center justify-between">
            <p className="text-red-200">{error}</p>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <DashboardStats analytics={analytics} isLoading={isLoading} />

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Volunteer Engagement */}
          <div className="card p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Engagement Rate</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {analytics.total_volunteers > 0
                    ? Math.round(
                        (analytics.active_volunteers / analytics.total_volunteers) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          {/* No-show Rate */}
          <div className="card p-6 border-l-4 border-red-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">No-show Rate</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {analytics.no_show_rate ? (analytics.no_show_rate * 100).toFixed(1) : 0}%
                </p>
              </div>
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>

          {/* Event Fill Rate */}
          <div className="card p-6 border-l-4 border-green-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Event Fill Rate</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {analytics.event_fill_rate
                    ? (analytics.event_fill_rate * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
      )}

      {/* Recent activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-white mb-4">⚡ Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/volunteers/new')}
              className="w-full btn-primary text-left"
            >
              ➕ Add Volunteer
            </button>
            <button
              onClick={() => navigate('/events/new')}
              className="w-full btn-secondary text-left"
            >
              📅 Create Event
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className="w-full btn-secondary text-left"
            >
              ⚡ Manage Tasks
            </button>
            <button
              onClick={() => navigate('/messages')}
              className="w-full btn-secondary text-left"
            >
              💬 Send Messages
            </button>
          </div>
        </div>

        {/* Admin Tips */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-white mb-4">💡 Admin Tips</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Check inactive volunteers monthly and send re-engagement messages</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Publish upcoming events 2-3 weeks in advance for better planning</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Award badges and recognition for consistent volunteers</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Send reminder messages 24h before events to reduce no-shows</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Admin Resources */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-white mb-4">📚 Admin Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/volunteers"
            className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-center"
          >
            <p className="text-2xl mb-2">👥</p>
            <p className="font-medium text-white">Manage Volunteers</p>
            <p className="text-xs text-slate-400 mt-1">View and edit volunteer profiles</p>
          </a>
          <a
            href="/events"
            className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-center"
          >
            <p className="text-2xl mb-2">📅</p>
            <p className="font-medium text-white">Manage Events</p>
            <p className="text-xs text-slate-400 mt-1">Create and publish events</p>
          </a>
          <a
            href="/tasks"
            className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-center"
          >
            <p className="text-2xl mb-2">⚡</p>
            <p className="font-medium text-white">Task Management</p>
            <p className="text-xs text-slate-400 mt-1">Track admin tasks and reminders</p>
          </a>
          <a
            href="/messages"
            className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-center"
          >
            <p className="text-2xl mb-2">💬</p>
            <p className="font-medium text-white">Send Messages</p>
            <p className="text-xs text-slate-400 mt-1">Broadcast updates to volunteers</p>
          </a>
        </div>
      </div>

      {/* Empty state message */}
      {analytics && analytics.total_volunteers === 0 && (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-4">👥</p>
          <h3 className="text-xl font-bold text-white mb-2">No Volunteers Yet</h3>
          <p className="text-slate-400 mb-6">Start by adding your first volunteer to get started!</p>
          <button
            onClick={() => navigate('/volunteers/new')}
            className="btn-primary"
          >
            Add First Volunteer
          </button>
        </div>
      )}
    </div>
  );
};
