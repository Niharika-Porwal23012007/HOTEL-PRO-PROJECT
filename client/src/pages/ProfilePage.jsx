import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Loader2, Save, LogOut } from 'lucide-react';
import api from '../services/api';

export const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        const userData = res.data?.data?.user;
        setFormData({
          name: userData?.name || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          address: userData?.address || '',
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.put('/auth/profile', formData);
      if (res.data?.data?.user) {
        setUser(res.data.data.user);
      }
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-16 text-muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-40 font-serif font-medium text-text mb-2">
          My Profile
        </h1>
        <p className="text-16 text-muted">
          Manage your account information
        </p>
      </div>

      <div className="bg-surface p-8 rounded-card border border-border space-y-8">
        {message.text && (
          <div className={`p-4 rounded-input ${
            message.type === 'success' ? 'bg-success/10 border border-success text-success' : 'bg-error/10 border border-error text-error'
          }`}>
            {message.text}
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-input text-16 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                value={formData.email}
                disabled
                className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-input text-16 text-muted cursor-not-allowed"
              />
            </div>
            <p className="text-14 text-muted mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-14 font-medium text-text mb-2">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-input text-16 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-14 font-medium text-text mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted" />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Your address"
                rows={3}
                className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-input text-16 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-error hover:text-error/80 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-16 font-medium">Sign out</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span className="text-16 font-medium">Save changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
