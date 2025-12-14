import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser, onAuthStateChange } from '../services/supabase';
import { useAuthStore } from '../store/authStore';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser: setStoreUser, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    setIsLoading(true);

    // Check initial auth state
    getCurrentUser()
      .then(async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          // Get session to retrieve access token
          const { data: { session } } = await supabase.auth.getSession();
          setStoreUser({
            id: currentUser.id,
            email: currentUser.email || '',
            role: 'admin',
          });
          if (session?.access_token) {
            setToken(session.access_token);
          }
        } else {
          setUser(null);
          logout();
        }
      })
      .finally(() => {
        setIsLoading(false);
        setLoading(false);
      });

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Get session to retrieve access token
        const { data: { session } } = await supabase.auth.getSession();
        setStoreUser({
          id: currentUser.id,
          email: currentUser.email || '',
          role: 'admin',
        });
        if (session?.access_token) {
          setToken(session.access_token);
        }
      } else {
        setUser(null);
        logout();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [setStoreUser, setToken, setLoading, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
