import React, { useEffect, useState } from 'react';
import { DashboardStats } from '../components/DashboardStats.js';
import { analyticsApi } from '../services/api.js';
import { AnalyticsSummary } from '../types/index.js';
import { RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsApi.summary();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
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

      {/* KPI Cards */}
      <DashboardStats analytics={analytics} isLoading={isLoading} />

      {/* Recent activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-white mb-4">⚡ Quick Actions</h2>
          <div className="space-y-2">
            <a href="/volunteers/new" className="block btn-primary text-center text-sm">
              ➕ Add Volunteer
            </a>
            <a href="/events/new" className="block btn-secondary text-center text-sm">
              📅 Create Event
            </a>
            <a href="/tasks/new" className="block btn-secondary text-center text-sm">
              ⚡ Create Task
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-white mb-4">💡 Tips & Reminders</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✓ Check inactive volunteers and reach out</li>
            <li>✓ Publish upcoming events to volunteers</li>
            <li>✓ Award badges for milestones</li>
            <li>✓ Send reminders 24h before events</li>
          </ul>
        </div>
      </div>

      {/* Empty state message */}
      {analytics && analytics.total_volunteers === 0 && (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-4">👥</p>
          <h3 className="text-xl font-bold text-white mb-2">No Volunteers Yet</h3>
          <p className="text-slate-400 mb-6">Start by adding your first volunteer to get started!</p>
          <a href="/volunteers/new" className="btn-primary">
            Add First Volunteer
          </a>
        </div>
      )}
    </div>
  );
};
