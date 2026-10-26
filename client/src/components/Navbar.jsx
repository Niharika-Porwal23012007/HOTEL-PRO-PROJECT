import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, LogOut, Menu, X, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="max-w-content mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-24 font-serif font-semibold text-primary">
              HotelPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/hotels"
              className="text-16 text-text hover:text-primary transition-colors"
            >
              Hotels
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-6 pl-6 border-l border-border">
                <Link
                  to="/my-bookings"
                  className="flex items-center space-x-2 text-16 text-text hover:text-primary"
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </Link>

                {user?.role === 'staff' && (
                  <Link
                    to="/staff"
                    className="text-16 text-text hover:text-primary"
                  >
                    Staff
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-16 text-text hover:text-primary"
                  >
                    Admin
                  </Link>
                )}

                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-16 text-text hover:text-primary"
                  >
                    <User className="w-5 h-5 text-muted" />
                    <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-16 text-muted hover:text-error transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-16 text-text hover:text-primary"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors"
                >
                  Create account
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-3">
          <Link
            to="/hotels"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-16 text-text"
          >
            Hotels
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-16 text-text"
              >
                My Bookings
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-16 text-text"
              >
                Profile
              </Link>
              {user?.role === 'staff' && (
                <Link
                  to="/staff"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-16 text-text"
                >
                  Staff
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-16 text-text"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left py-2 text-16 text-error"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-16 text-text"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-16 text-primary"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
