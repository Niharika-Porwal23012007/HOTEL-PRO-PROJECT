import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import api from '../services/api';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-32 font-serif font-medium text-text mb-2">
              Check your email
            </h1>
            <p className="text-16 text-muted">
              We've sent a password reset link to {email}
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-14 text-muted">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="text-primary hover:text-primary-hover text-16 font-medium"
            >
              Try again
            </button>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-muted hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-16">Back to sign in</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-32 font-serif font-medium text-text mb-2">
            Reset your password
          </h1>
          <p className="text-16 text-muted">
            Enter your email and we'll send you a reset link
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="text-16 font-medium">Send reset link</span>}
          </button>
        </form>

        <Link
          to="/login"
          className="inline-flex items-center space-x-2 text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-16">Back to sign in</span>
        </Link>
      </div>
    </div>
  );
};
