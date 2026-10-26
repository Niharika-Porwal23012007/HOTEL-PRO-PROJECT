import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
        <Building2 className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 mb-6">
        The destination you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-md shadow-brand-500/20"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
