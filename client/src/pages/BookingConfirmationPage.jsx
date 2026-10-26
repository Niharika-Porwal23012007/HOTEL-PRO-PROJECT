import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  Building,
  Loader2,
} from 'lucide-react';
import api from '../services/api';

export const BookingConfirmationPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data?.data?.booking);
      } catch (err) {
        console.error('Failed to load booking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
        <p className="text-xs font-semibold text-slate-500">Retrieving your confirmed voucher...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Booking Voucher Not Found</h2>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Confirmation Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Confirmed!</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Your room has been successfully reserved with zero risk of overbooking. A voucher email has been dispatched.
        </p>
      </div>

      {/* Voucher Ticket Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-brand-700 to-indigo-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-200 block">
              Booking Reference Number
            </span>
            <span className="text-2xl font-black tracking-tight font-mono">{booking.reference}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold border border-white/20 self-start sm:self-auto">
            Status: {booking.status}
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{booking.hotelId?.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>{booking.hotelId?.address || booking.hotelId?.city}</span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block font-medium">Room Category</span>
              <span className="text-sm font-bold text-slate-900">{booking.roomTypeId?.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Check-In</span>
              <span className="font-extrabold text-slate-800">{new Date(booking.checkIn).toLocaleDateString()}</span>
              <span className="text-[10px] text-slate-500 block">From 12:00 PM</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Check-Out</span>
              <span className="font-extrabold text-slate-800">{new Date(booking.checkOut).toLocaleDateString()}</span>
              <span className="text-[10px] text-slate-500 block">Until 11:00 AM</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Guests</span>
              <span className="font-extrabold text-slate-800">{booking.guests?.adults || 2} Adults</span>
              <span className="text-[10px] text-slate-500 block">{booking.rooms} Room(s)</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Amount Paid</span>
              <span className="font-extrabold text-brand-700">₹{booking.priceBreakdown?.totalAmount?.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-600 font-bold block">Test Paid</span>
            </div>
          </div>

          {/* Guest Name & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-800">Primary Guest: </span>
              <span>{booking.guestDetails?.name || 'Aarav Sharma'} ({booking.guestDetails?.email})</span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => window.print()}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Voucher</span>
              </button>
              <Link
                to="/my-bookings"
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md shadow-brand-500/20"
              >
                <span>My Bookings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
