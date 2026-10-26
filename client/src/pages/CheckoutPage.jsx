import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HoldTimer } from '../components/HoldTimer';
import { User, Mail, Phone, Tag, Loader2, AlertCircle, Calendar, Lock, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export const CheckoutPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null);
  const [payLoading, setPayLoading] = useState(false);
  const [guestForm, setGuestForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        const b = res.data?.data?.booking;
        setBooking(b);
        if (b?.guestDetails) {
          setGuestForm({
            name: b.guestDetails.name || '',
            email: b.guestDetails.email || '',
            phone: b.guestDetails.phone || '',
            specialRequests: b.guestDetails.specialRequests || '',
          });
        }
      } catch (err) {
        console.error('Failed to load hold booking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponApplying(true);
    setCouponMessage(null);

    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode,
        amount: booking.priceBreakdown.subtotal,
      });

      const coupon = res.data?.data?.coupon;
      const priceRes = await api.post('/bookings/calculate-price', {
        roomTypeId: booking.roomTypeId._id,
        rooms: booking.rooms,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        couponCode: coupon.code,
      });

      setBooking((prev) => ({
        ...prev,
        priceBreakdown: priceRes.data.data.priceBreakdown,
        couponCode: coupon.code,
      }));

      setCouponMessage({ type: 'success', text: `Coupon ${coupon.code} applied successfully!` });
    } catch (err) {
      setCouponMessage({
        type: 'error',
        text: err.response?.data?.message || 'Invalid or expired coupon code',
      });
    } finally {
      setCouponApplying(false);
    }
  };

  const handlePayment = async () => {
    setPayLoading(true);
    try {
      const orderRes = await api.post('/payments/create-order', { bookingId: booking._id });
      const { orderId, amount, currency, keyId } = orderRes.data.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'HotelPro Reservations',
        description: `Booking ${booking.reference} - ${booking.hotelId?.name}`,
        order_id: orderId,
        prefill: {
          name: guestForm.name,
          email: guestForm.email,
          contact: guestForm.phone,
        },
        theme: { color: '#115E59' },
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              bookingId: booking._id,
              razorpayOrderId: response.razorpay_order_id || orderId,
              razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || 'simulated_sig',
            });
            navigate(`/confirmation/${booking._id}`);
          } catch (verifyErr) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setPayLoading(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await api.post('/payments/verify', {
          bookingId: booking._id,
          razorpayOrderId: orderId,
          razorpayPaymentId: `pay_sim_${Date.now()}`,
          razorpaySignature: 'simulated_dev_signature',
        });
        navigate(`/confirmation/${booking._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment initiation failed. Please try again.');
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-16 text-muted">Preparing checkout session...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface rounded-card border border-border">
        <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
        <h2 className="text-24 font-serif font-medium text-text mb-2">Booking Session Expired</h2>
        <p className="text-16 text-muted mb-6">
          The requested booking hold was not found or has expired.
        </p>
        <button onClick={() => navigate('/hotels')} className="px-6 py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors text-16 font-medium">
          Search Available Hotels
        </button>
      </div>
    );
  }

  const pb = booking.priceBreakdown;

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-40 font-serif font-medium text-text mb-2">
          Complete your booking
        </h1>
        <p className="text-16 text-muted">
          Review your details and complete payment
        </p>
      </div>

      <HoldTimer
        expiresAt={booking.holdExpiresAt}
        onExpire={() => {
          alert('Your 10-minute hold has expired. The room has been released.');
          navigate(`/hotels/${booking.hotelId?._id}`);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Guest Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface p-8 rounded-card border border-border space-y-6">
            <h2 className="text-24 font-serif font-medium text-text flex items-center space-x-2">
              <User className="w-6 h-6 text-primary" />
              <span>Guest Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-14 font-medium text-text mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  value={guestForm.name}
                  onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-input text-16 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-14 font-medium text-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={guestForm.email}
                  onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-input text-16 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-14 font-medium text-text mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={guestForm.phone}
                  onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-input text-16 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-14 font-medium text-text mb-2">
                  Special requests (optional)
                </label>
                <input
                  type="text"
                  value={guestForm.specialRequests}
                  onChange={(e) => setGuestForm({ ...guestForm, specialRequests: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-input text-16 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Late check-in, quiet room, etc."
                />
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-success/10 p-6 rounded-card border border-success/20">
            <div className="flex items-center space-x-2 text-success mb-3">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-16 font-medium">Flexible Cancellation Policy</span>
            </div>
            <ul className="space-y-2 text-14 text-text">
              <li>• Full refund when cancelled 48+ hours before check-in</li>
              <li>• 50% refund between 24 and 48 hours</li>
              <li>• No refund if cancelled less than 24 hours before check-in</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Booking Summary */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-card border border-border space-y-6">
            <h3 className="text-24 font-serif font-medium text-text pb-4 border-b border-border">
              Booking Summary
            </h3>

            {/* Hotel Info */}
            <div className="space-y-2">
              <h4 className="text-18 font-medium text-text">{booking.hotelId?.name}</h4>
              <p className="text-14 text-muted">{booking.hotelId?.city}</p>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-14 rounded-input">
                {booking.roomTypeId?.name}
              </span>
            </div>

            {/* Dates */}
            <div className="p-4 bg-background rounded-input space-y-3 text-14 text-muted">
              <div className="flex justify-between">
                <span>Check-in</span>
                <span className="text-text font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out</span>
                <span className="text-text font-medium">{new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border font-medium text-primary">
                <span>Duration</span>
                <span>{booking.nights} {booking.nights === 1 ? 'night' : 'nights'} ({booking.rooms} room)</span>
              </div>
            </div>

            {/* Coupon */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-background border border-border rounded-input text-14 py-2 pl-10 pr-3 uppercase focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponApplying || !couponCode.trim()}
                  className="px-4 py-2 bg-text text-surface rounded-input hover:bg-text/90 transition-colors disabled:opacity-50 text-14 font-medium"
                >
                  {couponApplying ? 'Applying...' : 'Apply'}
                </button>
              </form>
              {couponMessage && (
                <p className={`text-14 mt-2 ${couponMessage.type === 'success' ? 'text-success' : 'text-error'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-14 text-muted pt-4 border-t border-border">
              <div className="flex justify-between">
                <span>₹{pb.pricePerNight?.toLocaleString('en-IN')} × {pb.nights} nights × {pb.roomCount} room</span>
                <span className="text-text font-medium">₹{pb.subtotal?.toLocaleString('en-IN')}</span>
              </div>

              {pb.couponDiscount > 0 && (
                <div className="flex justify-between text-success font-medium">
                  <span>Coupon Discount ({booking.couponCode})</span>
                  <span>- ₹{pb.couponDiscount?.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST (12%)</span>
                <span className="text-text font-medium">₹{pb.taxAmount?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-18 font-medium text-text pt-4 border-t border-border">
                <span>Total</span>
                <span className="text-accent">₹{pb.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={payLoading}
              className="w-full py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {payLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span className="text-16 font-medium">Pay securely</span>
                </>
              )}
            </button>
            <p className="text-14 text-muted text-center">
              Test mode enabled - no real charges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
