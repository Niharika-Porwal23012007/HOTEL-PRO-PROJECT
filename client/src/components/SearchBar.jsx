import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

export const SearchBar = ({ initialValues = {}, compact = false }) => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [city, setCity] = useState(initialValues.city || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || today);
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || tomorrow);
  const [guests, setGuests] = useState(initialValues.guests || 2);
  const [rooms, setRooms] = useState(initialValues.rooms || 1);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // SRC-02: Date validation
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    const diffDays = Math.round(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > 30) {
      setError('Maximum stay length is 30 nights');
      return;
    }

    const params = new URLSearchParams({
      city,
      checkIn,
      checkOut,
      guests: guests.toString(),
      rooms: rooms.toString(),
    });

    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className={`w-full ${compact ? '' : 'max-w-5xl mx-auto'}`}>
      <form
        onSubmit={handleSubmit}
        className={`bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 sm:p-4 grid grid-cols-1 ${
          compact ? 'md:grid-cols-4 gap-3' : 'md:grid-cols-5 gap-3'
        }`}
      >
        {/* City Destination */}
        <div className="relative flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
          <MapPin className="w-5 h-5 text-brand-600 mr-2 shrink-0" />
          <div className="w-full">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Destination
            </label>
            <input
              type="text"
              placeholder="City, area (e.g. Goa, Mumbai)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder-slate-400"
            />
          </div>
        </div>

        {/* Check In */}
        <div className="relative flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
          <Calendar className="w-5 h-5 text-brand-600 mr-2 shrink-0" />
          <div className="w-full">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Check-In
            </label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Check Out */}
        <div className="relative flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
          <Calendar className="w-5 h-5 text-brand-600 mr-2 shrink-0" />
          <div className="w-full">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Check-Out
            </label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Guests & Rooms */}
        <div className="relative flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
          <Users className="w-5 h-5 text-brand-600 mr-2 shrink-0" />
          <div className="w-full flex space-x-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
              >
                {[1, 2, 3, 4, 6, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
            <div className="border-l border-slate-200 pl-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Rooms
              </label>
              <select
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Room' : 'Rooms'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search CTA */}
        <div className={compact ? 'md:col-span-4 lg:col-span-1' : 'flex items-center'}>
          <button
            type="submit"
            className="w-full h-full min-h-[48px] bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-2 text-center text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl">
          {error}
        </div>
      )}
    </div>
  );
};
