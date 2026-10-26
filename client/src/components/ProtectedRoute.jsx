import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-rose-600 mb-2">Access Denied</h2>
        <p className="text-xs text-slate-600 mb-6">
          Your account role ({user.role}) does not have permission to access this page.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Home
        </a>
      </div>
    );
  }

  return children;
};
