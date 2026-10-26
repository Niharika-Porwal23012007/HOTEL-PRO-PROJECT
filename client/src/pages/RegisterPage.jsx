import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Phone, Loader2, Check } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'guest',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength checks (AUTH-02)
  const pwd = formData.password;
  const hasMinLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const strengthScore = [hasMinLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (strengthScore < 4) {
      setError('Password must meet all 4 security requirements.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
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
            Create your account
          </h2>
          <p className="text-16">
            Join thousands of travelers booking with HotelPro
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-32 font-serif font-medium text-text mb-2">
              Create account
            </h1>
            <p className="text-16 text-muted">
              Enter your details to get started
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
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-3 py-2 bg-surface border border-border rounded-input text-16 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-14 font-medium text-text mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2 bg-surface border border-border rounded-input text-16 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-14 font-medium text-text mb-2">
                Phone (optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2 text-14">
                    <div className="flex-1 h-1 bg-border rounded overflow-hidden">
                      <div 
                        className={`h-full transition-all ${strengthScore === 4 ? 'bg-success' : strengthScore >= 2 ? 'bg-warning' : 'bg-error'}`}
                        style={{ width: `${(strengthScore / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-muted">{strengthScore === 4 ? 'Strong' : strengthScore >= 2 ? 'Medium' : 'Weak'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-14">
                    <div className={`flex items-center space-x-2 ${hasMinLength ? 'text-success' : 'text-muted'}`}>
                      <Check className="w-4 h-4" />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${hasUpper ? 'text-success' : 'text-muted'}`}>
                      <Check className="w-4 h-4" />
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${hasLower ? 'text-success' : 'text-muted'}`}>
                      <Check className="w-4 h-4" />
                      <span>Lowercase</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${hasNumber ? 'text-success' : 'text-muted'}`}>
                      <Check className="w-4 h-4" />
                      <span>Number</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="text-16 font-medium">Create account</span>}
            </button>
          </form>

          <div className="text-center text-14 text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
