import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { signIn, getCurrentUser, supabase } from '../services/supabase.js';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import logo from '../assets/logo.svg';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setLoading, setError, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    // Check if already logged in - but only redirect if we have a valid session with token
    getCurrentUser().then(async (user) => {
      if (user) {
        // Also check if we have a valid session token
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          // User is properly authenticated, redirect to dashboard
          navigate('/dashboard');
        }
        // Otherwise stay on login page
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted', { email, hasPassword: !!password });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:24',message:'Login attempt started',data:{hasEmail:!!email,emailLength:email.length,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H'})}).catch((err)=>console.error('Log fetch failed:',err));
    // #endregion
    setLocalError('');
    setLoading(true);

    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:32',message:'Before signIn call',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      const data = await signIn(email, password);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:35',message:'SignIn succeeded',data:{hasSession:!!data.session,hasUser:!!data.session?.user},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H'})}).catch(()=>{});
      // #endregion

      if (data.session?.user) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:42',message:'Setting user and token',data:{userId:data.session.user.id,hasToken:!!data.session.access_token,tokenLength:data.session.access_token?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'auth-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          role: 'admin',
        });
        setToken(data.session.access_token);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:49',message:'Token set, navigating',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'auth-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion

        navigate('/dashboard');
      }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/427d9eb7-fa35-4a6d-a3f6-c3b69ecd1468',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LoginPage.tsx:48',message:'Login error',data:{errorMessage:err instanceof Error?err.message:String(err),errorType:err?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setLocalError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
              <img src={logo} alt="Technexus" className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Technexus</h1>
            <p className="text-slate-400">Admin Volunteer Management</p>
          </div>

          {/* Error message */}
          {localError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{localError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              onClick={(e) => {
                console.log('Button clicked', { email, hasPassword: !!password, isLoading });
                // Let the form onSubmit handle it, but log for debugging
              }}
              disabled={isLoading}
              className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <span>🔑</span>
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          {/* Demo info */}
          <div className="mt-8 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <p className="text-xs text-slate-400 mb-2">💡 Demo Credentials:</p>
            <p className="text-xs text-slate-300 font-mono">
              admin@example.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
