import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const HoldTimer = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateRemaining = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    setTimeLeft(calculateRemaining());

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isUrgent = timeLeft < 180; // less than 3 minutes

  if (timeLeft <= 0) {
    return (
      <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Your 10-minute hold has expired. The room has been released to other guests.</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
        isUrgent
          ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
          : 'bg-brand-50 border-brand-200 text-brand-900'
      }`}
    >
      <div className="flex items-center space-x-2">
        <Clock className={`w-4 h-4 ${isUrgent ? 'text-amber-600' : 'text-brand-600'}`} />
        <span className="text-xs font-semibold">
          {isUrgent ? 'Hurry! Room hold expires in:' : 'Room held for you: complete booking within:'}
        </span>
      </div>
      <div className="font-mono font-black text-sm">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};
