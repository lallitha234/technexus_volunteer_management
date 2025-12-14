import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import { getCurrentUser, onAuthStateChange, supabase } from './services/supabase.js';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';

// Pages
import { LoginPage } from './pages/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { VolunteersPage } from './pages/VolunteersPage.js';
import { NewVolunteerPage } from './pages/NewVolunteerPage.js';
import { EditVolunteerPage } from './pages/EditVolunteerPage.js';
import { EventsPage } from './pages/EventsPage.js';
import { NewEventPage } from './pages/NewEventPage.js';
import { TasksPage } from './pages/TasksPage.js';
import { MessagesPage } from './pages/MessagesPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';
import { Loader } from 'lucide-react';

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const { setUser, setToken, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    // Check initial auth state
    getCurrentUser()
      .then(async (user) => {
        if (user) {
          // Get session to retrieve access token
          const { data: { session } } = await supabase.auth.getSession();
          setUser({
            id: user.id,
            email: user.email || '',
            role: 'admin',
          });
          if (session?.access_token) {
            setToken(session.access_token);
          }
        }
      })
      .finally(() => setLoading(false));

    // Listen for auth changes
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // Get session to retrieve access token
        const { data: { session } } = await supabase.auth.getSession();
        setUser({
          id: user.id,
          email: user.email || '',
          role: 'admin',
        });
        if (session?.access_token) {
          setToken(session.access_token);
        }
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return () => unsubscribe?.data?.subscription?.unsubscribe();
  }, [setUser, setToken, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers"
          element={
            <ProtectedRoute>
              <VolunteersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers/new"
          element={
            <ProtectedRoute>
              <NewVolunteerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteers/:id/edit"
          element={
            <ProtectedRoute>
              <EditVolunteerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/new"
          element={
            <ProtectedRoute>
              <NewEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
