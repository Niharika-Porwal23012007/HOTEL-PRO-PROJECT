import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword, false);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Hotel Photo */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
          alt="Hotel"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-32 font-serif font-medium mb-2">
            Welcome back
          </h2>
          <p className="text-16">
            Sign in to manage your bookings and preferences
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-32 font-serif font-medium text-text mb-2">
              Sign in
            </h1>
            <p className="text-16 text-muted">
              Enter your email and password to continue
            </p>
          </div>

          {error && (
            <div className="p-4 bg-error/10 border border-error text-error text-14 rounded-input">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-14 font-medium text-text mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2 bg-surface border border-border rounded-input text-16 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-14 font-medium text-text mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 bg-surface border border-border rounded-input text-16 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-14">
              <label className="flex items-center space-x-2 text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary hover:text-primary-hover">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="text-16 font-medium">Sign in</span>}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-6 border-t border-border space-y-3">
            <span className="text-14 text-muted block">
              Quick demo accounts:
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('guest@hotelpro.com', 'Guest@123')}
                className="py-2 px-3 bg-surface border border-border text-14 text-text rounded-input hover:border-primary transition-colors"
              >
                Guest
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('staff@hotelpro.com', 'Staff@123')}
                className="py-2 px-3 bg-surface border border-border text-14 text-text rounded-input hover:border-primary transition-colors"
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@hotelpro.com', 'Admin@123')}
                className="py-2 px-3 bg-surface border border-border text-14 text-text rounded-input hover:border-primary transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-14 text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-hover font-medium">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
