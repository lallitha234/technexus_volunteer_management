import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">⚙️ Settings</h1>
        <p className="text-slate-400 mt-1">Manage admin settings and preferences</p>
      </div>

      <div className="card p-8 text-center">
        <p className="text-4xl mb-4">🔨</p>
        <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
        <p className="text-slate-400">Settings panel coming in next update</p>
      </div>
    </div>
  );
};
