import React, { useState, useEffect } from 'react';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Building,
  Users,
  Award,
  Calendar,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import api from '../services/api';

export const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
      ]);
      setAnalytics(analyticsRes.data?.data);
      setUsers(usersRes.data?.data?.users || []);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}`, { role: newRole });
      alert(`User role changed to ${newRole}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-xs font-semibold text-slate-500">Compiling executive analytics & audits...</p>
      </div>
    );
  }

  const s = analytics?.summary || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Platform Administration (ADM-01 - ADM-03)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Platform revenue, occupancy metrics, and user management.</p>
      </div>

      {/* Metric Cards (ADM-03) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{s.totalRevenue ? s.totalRevenue.toLocaleString('en-IN') : '0'}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block">100% test captured</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{s.totalBookings || 0}</div>
          <span className="text-[10px] text-brand-600 font-bold block">0 overbookings</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Properties</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{s.totalHotels || 0}</div>
          <span className="text-[10px] text-purple-600 font-bold block">Across 5 top metros</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Registered Users</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{s.totalUsers || 0}</div>
          <span className="text-[10px] text-amber-600 font-bold block">Role-governed sessions</span>
        </div>
      </div>

      {/* Top Properties & User Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Properties Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Top Revenue Properties</h3>
          <div className="space-y-3">
            {analytics?.topHotels?.length === 0 ? (
              <p className="text-xs text-slate-400">No confirmed bookings yet</p>
            ) : (
              analytics?.topHotels?.map((h, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-3 rounded-2xl bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block">{h.name}</span>
                    <span className="text-[10px] text-slate-400">{h.city} • {h.bookingsCount} bookings</span>
                  </div>
                  <span className="font-black text-brand-700">₹{h.revenue?.toLocaleString('en-IN')}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Management (ADM-01) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">User Access & Roles (ADM-01)</h3>
            <span className="text-xs font-semibold text-slate-500">{users.length} Users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Modify Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3">
                      <span className="font-bold text-slate-800 block">{u.name}</span>
                      <span className="text-[11px] text-slate-400">{u.email}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          u.role === 'admin'
                            ? 'bg-rose-50 text-rose-700'
                            : u.role === 'staff'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold px-2 py-1 focus:outline-none"
                      >
                        <option value="guest">Guest</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
