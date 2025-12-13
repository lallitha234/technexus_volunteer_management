import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Zap, BarChart3, MessageSquare, Settings } from 'lucide-react';

const MENU_ITEMS = [
  { label: '📊 Dashboard', path: '/dashboard', icon: BarChart3 },
  { label: '👥 Volunteers', path: '/volunteers', icon: Users },
  { label: '📅 Events', path: '/events', icon: Calendar },
  { label: '⚡ Tasks', path: '/tasks', icon: Zap },
  { label: '💬 Messages', path: '/messages', icon: MessageSquare },
  { label: '⚙️ Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900/50 backdrop-blur border-r border-slate-700/50 min-h-screen sticky top-16">
      <nav className="flex-1 p-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 text-center">
          ✨ Version 1.0.0 <br /> Built with 💜 for community
        </p>
      </div>
    </aside>
  );
};
