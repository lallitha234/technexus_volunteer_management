import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';

const MENU_ITEMS = [
  { 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: '📊',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10 group-hover:bg-blue-500/20'
  },
  { 
    label: 'Volunteers', 
    path: '/volunteers', 
    icon: '👥',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10 group-hover:bg-purple-500/20'
  },
  { 
    label: 'Events', 
    path: '/events', 
    icon: '📅',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/10 group-hover:bg-pink-500/20'
  },
  { 
    label: 'Tasks', 
    path: '/tasks', 
    icon: '⚡',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/10 group-hover:bg-amber-500/20'
  },
  { 
    label: 'Messages', 
    path: '/messages', 
    icon: '💬',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10 group-hover:bg-green-500/20'
  },
  { 
    label: 'Settings', 
    path: '/settings', 
    icon: '⚙️',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-500/10 group-hover:bg-slate-500/20'
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl border-r border-slate-800/50 min-h-screen sticky top-16 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-8 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl shadow-lg">
            <img src={logo} alt="Technexus" className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Technexus</h1>
            <p className="text-xs text-slate-500">Volunteer Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-2 mb-2">Menu</p>
        
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-500/20`
                  : `text-slate-300 hover:text-white ${item.bgColor}`
              }`}
            >
              {/* Icon container */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'bg-white/20 scale-110'
                  : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <span className="text-lg">{item.icon}</span>
              </div>

              {/* Label */}
              <span className="flex-1">{item.label}</span>

              {/* Active indicator */}
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50"></div>
              )}

              {/* Background glow effect */}
              {isActive && (
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-white">✨ Pro Tip</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use keyboard shortcuts for faster navigation. Press <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-slate-200">?</code> for help.
          </p>
        </div>
        <p className="text-xs text-slate-600 text-center mt-4">
          v1.0.0 • Built for community
        </p>
      </div>
    </aside>
  );
};
