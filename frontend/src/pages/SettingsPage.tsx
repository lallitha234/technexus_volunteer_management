import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, Bell, Download, RefreshCw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setToken } = useAuthStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setUser(null);
      setToken(null);
      navigate('/login');
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // This would call an export API endpoint
      // For now, we'll just show a loading state
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Export completed! Check your downloads folder.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">⚙️ Settings</h1>
        <p className="text-slate-400 mt-1">Manage admin settings and preferences</p>
      </div>

      {/* Account Settings */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Account Settings
        </h2>

        <div className="space-y-3">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Logged in as</p>
            <p className="font-medium text-white">{user?.email}</p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Role</p>
            <p className="font-medium text-white capitalize">{user?.role || 'Admin'}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>

        <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-0 cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-white">Email Notifications</p>
            <p className="text-sm text-slate-400">Get updates about volunteer activities</p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
          <input
            type="checkbox"
            checked={eventReminders}
            onChange={(e) => setEventReminders(e.target.checked)}
            className="w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-0 cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-white">Event Reminders</p>
            <p className="text-sm text-slate-400">Get notified before upcoming events</p>
          </div>
        </label>
      </div>

      {/* Data Management */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5" />
          Data Management
        </h2>

        <p className="text-sm text-slate-400">
          Export your data in CSV format for backup or analysis
        </p>

        <button
          onClick={handleExportData}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`}
          />
          {isExporting ? 'Exporting...' : 'Export All Data'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📊</span> System Info
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">App Version</p>
            <p className="font-medium text-white">1.0.0</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Last Updated</p>
            <p className="font-medium text-white">Today</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Status</p>
            <p className="font-medium text-green-400">✅ Running</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">Database</p>
            <p className="font-medium text-green-400">✅ Connected</p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">❓ Help & Support</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>📚 <a href="#" className="text-blue-400 hover:underline">View Documentation</a></li>
          <li>🐛 <a href="#" className="text-blue-400 hover:underline">Report a Bug</a></li>
          <li>💬 <a href="#" className="text-blue-400 hover:underline">Contact Support</a></li>
          <li>📖 <a href="#" className="text-blue-400 hover:underline">API Reference</a></li>
        </ul>
      </div>
    </div>
  );
};
