import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({ upcoming: [], past: [], cancelled: [], all: [] });
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/mine');
      setBookings(res.data?.data || { upcoming: [], past: [], cancelled: [], all: [] });
    } catch (err) {
      console.error('Failed to load my bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? Refund will be calculated based on the 48h/24h cancellation policy.'
    );
    if (!confirmed) return;

    setCancellingId(bookingId);
    try {
      const res = await api.patch(`/bookings/${bookingId}/cancel`);
      const { refundPercentage, refundAmount } = res.data.data;
      alert(`Booking cancelled successfully. Refund: ${refundPercentage}% (₹${refundAmount.toLocaleString('en-IN')})`);
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const currentList = bookings[activeTab] || [];

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-40 font-serif font-medium text-text mb-2">
          My Bookings
        </h1>
        <p className="text-16 text-muted">
          Manage your upcoming, past, and cancelled stays
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border space-x-8 mb-8">
        {[
          { key: 'upcoming', label: 'Upcoming', count: bookings.upcoming?.length || 0 },
          { key: 'past', label: 'Past Stays', count: bookings.past?.length || 0 },
          { key: 'cancelled', label: 'Cancelled', count: bookings.cancelled?.length || 0 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-4 border-b-2 flex items-center space-x-2 transition ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            <span className="text-16 font-medium">{tab.label}</span>
            <span
              className={`text-14 px-2 py-0.5 rounded-input ${
                activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-background text-muted'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-16 text-muted">Loading your reservations...</p>
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-surface p-12 text-center rounded-card border border-border space-y-6">
          <Calendar className="w-16 h-16 text-muted mx-auto" />
          <h3 className="text-24 font-serif font-medium text-text">No {activeTab} bookings found</h3>
          <p className="text-16 text-muted max-w-md mx-auto">
            Ready to plan your next journey? Browse our catalog of verified hotels.
          </p>
          <Link
            to="/hotels"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors text-16 font-medium"
          >
            <span>Explore Hotels</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {currentList.map((b) => {
            const isConfirmed = b.status === 'Confirmed' || b.status === 'Checked-in';
            const isCancelled = b.status === 'Cancelled' || b.status === 'Expired';

            return (
              <div
                key={b._id}
                className="bg-surface rounded-card border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-14 text-muted font-mono">{b.reference}</span>
                      <span
                        className={`text-14 font-medium px-3 py-1 rounded-input ${
                          isConfirmed
                            ? 'bg-success/10 text-success border border-success/20'
                            : isCancelled
                            ? 'bg-error/10 text-error border border-error/20'
                            : 'bg-warning/10 text-warning border border-warning/20'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-24 font-serif font-medium text-text">{b.hotelId?.name}</h3>
                      <p className="text-14 text-muted flex items-center space-x-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{b.hotelId?.city}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 text-14 text-muted">
                      <span className="bg-background px-3 py-2 rounded-input">
                        <span className="text-text font-medium">Dates:</span> {new Date(b.checkIn).toLocaleDateString()} –{' '}
                        {new Date(b.checkOut).toLocaleDateString()} ({b.nights} {b.nights === 1 ? 'night' : 'nights'})
                      </span>
                      <span className="bg-background px-3 py-2 rounded-input">
                        <span className="text-text font-medium">Room:</span> {b.roomTypeId?.name} ({b.rooms} room)
                      </span>
                      <span className="bg-background px-3 py-2 rounded-input">
                        <span className="text-text font-medium">Total:</span> ₹{b.priceBreakdown?.totalAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col justify-center gap-3 shrink-0">
                    <Link
                      to={`/confirmation/${b._id}`}
                      className="px-6 py-3 bg-background border border-border text-text rounded-input hover:border-primary hover:text-primary transition-colors text-16 font-medium text-center"
                    >
                      View Voucher
                    </Link>

                    {isConfirmed && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        disabled={cancellingId === b._id}
                        className="px-6 py-3 bg-error/10 text-error border border-error/20 rounded-input hover:bg-error/20 transition-colors text-16 font-medium disabled:opacity-50"
                      >
                        {cancellingId === b._id ? 'Cancelling...' : 'Cancel Stay'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
