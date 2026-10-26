import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, MapPin, Check, Users, Bed, ArrowRight, Loader2, Calendar, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { SafeImage } from '../components/SafeImage';
import { resolveGallery } from '../utils/images';

export const HotelDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || today);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || tomorrow);
  const [rooms, setRooms] = useState(Number(searchParams.get('rooms')) || 1);
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);

  useEffect(() => {
    const fetchHotelData = async () => {
      setLoading(true);
      try {
        const [hotelRes, reviewRes] = await Promise.all([
          api.get(`/hotels/${id}`, { params: { checkIn, checkOut } }),
          api.get(`/reviews/hotel/${id}`),
        ]);

        setHotel(hotelRes.data?.data?.hotel);
        setRoomTypes(hotelRes.data?.data?.roomTypes || []);
        setReviews(reviewRes.data?.data?.reviews || []);
      } catch (err) {
        console.error('Failed to load hotel:', err);
        setError('Could not load hotel information');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id, checkIn, checkOut]);

  const handleSelectRoom = async (room) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname + window.location.search } });
      return;
    }

    if (room.availableRooms < rooms) {
      alert(`Only ${room.availableRooms} rooms available for the selected dates.`);
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/bookings/hold', {
        hotelId: hotel._id,
        roomTypeId: room._id,
        rooms,
        checkIn,
        checkOut,
        guests: { adults: guests, children: 0 },
        guestDetails: {
          name: user?.name || 'Primary Guest',
          email: user?.email || 'guest@hotelpro.com',
          phone: user?.phone || '+91 9876543210',
        },
      });

      const booking = res.data?.data?.booking;
      navigate(`/checkout/${booking._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to hold room. Please retry.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-16 text-muted">Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-surface rounded-card border border-border">
        <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
        <h2 className="text-24 font-serif font-medium text-text mb-2">Hotel not found</h2>
        <p className="text-16 text-muted mb-6">The hotel requested might be disabled or unavailable.</p>
        <button onClick={() => navigate('/hotels')} className="px-6 py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors text-16 font-medium">
          Back to Search
        </button>
      </div>
    );
  }

  const galleryImages = resolveGallery(hotel.images);

  return (
    <div className="max-w-content mx-auto px-4 py-12 space-y-12">
      {/* Hotel Header */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-14 text-muted ml-2">{hotel.propertyType || 'Hotel'}</span>
        </div>
        <h1 className="text-40 md:text-48 font-serif font-medium text-text mb-3">
          {hotel.name}
        </h1>
        <div className="flex items-center text-16 text-muted space-x-2">
          <MapPin className="w-5 h-5" />
          <span>{hotel.address}</span>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-32 font-serif font-medium text-accent">{hotel.avgRating || 4.8}</span>
            <div className="text-left">
              <p className="text-14 text-text font-medium">Exceptional</p>
              <p className="text-14 text-muted">{hotel.reviewCount || 0} reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-card overflow-hidden">
        <div className="md:col-span-3 h-80 md:h-[500px] relative">
          <SafeImage
            src={galleryImages[activeImageIndex] || galleryImages[0]}
            alt={hotel.name}
            className="w-full h-full object-cover bg-stone-200"
          />
        </div>
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px]">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`h-24 md:h-32 rounded-card overflow-hidden border-2 shrink-0 w-32 md:w-full transition ${
                activeImageIndex === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <SafeImage src={img} alt={`${hotel.name} photo ${idx + 1}`} className="w-full h-full object-cover bg-stone-200" />
            </button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-surface p-6 rounded-card border border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 text-16 text-text">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium">Select your dates</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-3 bg-background p-3 rounded-input border border-border">
              <span className="text-14 text-muted">Check-in</span>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-16 text-text focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-3 bg-background p-3 rounded-input border border-border">
              <span className="text-14 text-muted">Check-out</span>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-16 text-text focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-3 bg-background p-3 rounded-input border border-border">
              <span className="text-14 text-muted">Rooms</span>
              <select
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="bg-transparent text-16 text-text focus:outline-none"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Amenities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface p-8 rounded-card border border-border">
            <h2 className="text-24 font-serif font-medium text-text mb-4">About this property</h2>
            <p className="text-16 text-muted leading-relaxed whitespace-pre-line">
              {hotel.description}
            </p>
          </div>

          <div className="bg-surface p-8 rounded-card border border-border">
            <h2 className="text-24 font-serif font-medium text-text mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-16 text-text">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface p-8 rounded-card border border-border">
            <h2 className="text-24 font-serif font-medium text-text mb-6">Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-16 font-medium text-text mb-2">Check-in / Check-out</h3>
                <p className="text-14 text-muted">Check-in: {hotel.policies?.checkInTime || '12:00 PM'}</p>
                <p className="text-14 text-muted">Check-out: {hotel.policies?.checkOutTime || '11:00 AM'}</p>
              </div>
              <div>
                <h3 className="text-16 font-medium text-text mb-2">Pet Policy</h3>
                <p className="text-14 text-muted">
                  {hotel.policies?.petsAllowed ? 'Pets are allowed' : 'Pets are not allowed'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Booking Card */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-surface p-6 rounded-card border border-border shadow-sm">
            <h3 className="text-18 font-serif font-medium text-text mb-4">Your stay</h3>
            <div className="space-y-3 text-14 text-muted mb-6">
              <div className="flex justify-between">
                <span>Check-in</span>
                <span className="text-text">{checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out</span>
                <span className="text-text">{checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Rooms</span>
                <span className="text-text">{rooms}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests</span>
                <span className="text-text">{guests}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/hotels')}
              className="w-full py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors text-16 font-medium"
            >
              View available rooms
            </button>
          </div>
        </div>
      </div>

      {/* Room Types */}
      <div>
        <h2 className="text-32 font-serif font-medium text-text mb-6">Available rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roomTypes.map((room) => {
            const isSoldOut = room.availableRooms < rooms;

            return (
              <div
                key={room._id}
                className={`bg-surface rounded-card border overflow-hidden ${
                  isSoldOut ? 'border-border opacity-60' : 'border-border hover:shadow-md transition-shadow'
                }`}
              >
                <div className="h-56 relative">
                  <SafeImage
                    src={room.images?.[0] || galleryImages[0]}
                    alt={room.name}
                    className="w-full h-full object-cover bg-stone-200"
                  />
                  {!isSoldOut && room.availableRooms <= 3 && (
                    <span className="absolute top-4 left-4 bg-accent text-surface text-14 font-medium px-3 py-1 rounded-input">
                      Only {room.availableRooms} left
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-24 font-serif font-medium text-text mb-2">{room.name}</h3>
                  <div className="flex items-center space-x-4 text-14 text-muted mb-4">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{room.capacity?.adults || 2} adults</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Bed className="w-4 h-4" />
                      <span>{room.bedType || 'King bed'}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities?.slice(0, 3).map((a, i) => (
                      <span key={i} className="text-14 text-muted bg-background px-2 py-1 rounded">
                        {a}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border flex items-end justify-between">
                    <div>
                      <span className="text-14 text-muted block">Price per night</span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-32 font-serif font-medium text-accent">
                          ₹{room.pricePerNight?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-14 text-success">Free cancellation</span>
                    </div>

                    <button
                      disabled={isSoldOut || bookingLoading}
                      onClick={() => handleSelectRoom(room)}
                      className={`px-6 py-3 rounded-input text-16 font-medium transition flex items-center space-x-2 ${
                        isSoldOut
                          ? 'bg-background text-muted cursor-not-allowed'
                          : 'bg-primary text-surface hover:bg-primary-hover'
                      }`}
                    >
                      {isSoldOut ? (
                        <span>Sold out</span>
                      ) : (
                        <>
                          <span>Reserve</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-surface p-8 rounded-card border border-border">
        <h2 className="text-32 font-serif font-medium text-text mb-6">Guest reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-16 text-muted text-center py-8">
            No reviews yet for this property
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-6 bg-background rounded-card border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-18 font-serif font-medium">
                      {rev.userId?.name?.charAt(0) || 'G'}
                    </div>
                    <div>
                      <p className="text-16 font-medium text-text">{rev.userId?.name || 'Verified Guest'}</p>
                      <p className="text-14 text-muted">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-16 text-text leading-relaxed">{rev.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
