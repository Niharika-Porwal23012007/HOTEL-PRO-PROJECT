import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, Calendar, CheckCircle, Clock, Loader2, Users } from 'lucide-react';
import api from '../services/api';

export const StaffDashboardPage = () => {
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const [hotelsRes, bookingsRes] = await Promise.all([
        api.get('/staff/hotels'),
        api.get('/staff/bookings'),
      ]);
      const hList = hotelsRes.data?.data?.hotels || [];
      setHotels(hList);
      setBookings(bookingsRes.data?.data?.bookings || []);
      if (hList.length > 0 && !selectedHotel) {
        setSelectedHotel(hList[0]._id);
      }
    } catch (err) {
      console.error('Failed to load staff dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await api.patch(`/staff/bookings/${bookingId}/status`, { status: newStatus });
      alert(`Booking updated to ${newStatus}`);
      fetchStaffData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredBookings = selectedHotel
    ? bookings.filter((b) => b.hotelId?._id === selectedHotel || b.hotelId === selectedHotel)
    : bookings;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-xs font-semibold text-slate-500">Loading hotel management portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Staff Portal (STF-01 - STF-03)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hotel Operations</h1>
          <p className="text-xs text-slate-500 mt-1">Manage guest arrivals, room status, and daily occupancy.</p>
        </div>

        {/* Hotel Filter Dropdown */}
        {hotels.length > 0 && (
          <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 pr-4 py-1.5 focus:outline-none"
            >
              <option value="">All Managed Properties</option>
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bookings & Front Desk Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Guest Arrivals & Reservations</h3>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
            {filteredBookings.length} Total Bookings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Ref / Guest</th>
                <th className="px-6 py-3.5">Property / Room</th>
                <th className="px-6 py-3.5">Dates</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Front Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-900 block">{b.reference}</span>
                    <span className="text-slate-500">{b.guestDetails?.name || b.userId?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 block">{b.hotelId?.name}</span>
                    <span className="text-[11px] text-slate-400">{b.roomTypeId?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span>{new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}</span>
                    <span className="block text-[10px] text-slate-400">{b.nights} Nights</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ₹{b.priceBreakdown?.totalAmount?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Confirmed'
                          ? 'bg-blue-50 text-blue-700'
                          : b.status === 'Checked-in'
                          ? 'bg-amber-50 text-amber-700'
                          : b.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'Checked-in')}
                        className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold transition shadow-sm"
                      >
                        Check In
                      </button>
                    )}
                    {b.status === 'Checked-in' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'Completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm"
                      >
                        Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
