import React from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import logo from '../assets/logo.svg';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <img src={logo} alt="Technexus" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Technexus</h1>
              <p className="text-xs text-slate-400">Volunteer Central</p>
            </div>
          </div>

          {/* Admin info */}
          <div className="hidden sm:flex items-center gap-4">
            {user && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user.email}</p>
                  <p className="text-xs text-slate-400">Admin</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm gap-2 flex items-center"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button
            className="sm:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu content */}
      {menuOpen && (
        <div className="sm:hidden border-t border-slate-700/50 p-4 space-y-4">
          {user && (
            <>
              <p className="text-sm text-white font-medium">{user.email}</p>
              <button
                onClick={handleLogout}
                className="w-full btn-secondary text-sm gap-2 flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
