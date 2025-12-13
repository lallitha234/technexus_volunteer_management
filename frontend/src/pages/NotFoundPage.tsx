import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🤔</div>
        <h1 className="text-4xl font-bold text-white mb-2">404 - Page Not Found</h1>
        <p className="text-slate-400 mb-8">Looks like this page doesn't exist</p>

        <div className="space-y-3">
          {user ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="block w-full btn-primary"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/volunteers')}
                className="block w-full btn-secondary"
              >
                Go to Volunteers
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="block w-full btn-primary"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
