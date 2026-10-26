import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { FALLBACK_HOTEL_IMAGE } from '../utils/images';

export const HotelCard = ({ hotel, searchParams = {}, compact = false }) => {
  const query = new URLSearchParams(searchParams).toString();
  const detailUrl = `/hotels/${hotel._id}${query ? `?${query}` : ''}`;

  if (compact) {
    return (
      <Link
        to={detailUrl}
        className="relative w-72 shrink-0 rounded-card overflow-hidden group"
      >
        <SafeImage
          src={hotel.images?.[0] || FALLBACK_HOTEL_IMAGE}
          alt={hotel.name}
          className="w-full h-48 object-cover bg-stone-200 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-18 font-serif font-medium mb-1 truncate">{hotel.name}</h3>
          <div className="flex items-center space-x-1 text-14">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{hotel.city}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-surface rounded-card border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
      {/* Thumbnail */}
      <div className="relative md:w-72 h-56 md:h-auto shrink-0 overflow-hidden">
        <SafeImage
          src={hotel.images?.[0] || FALLBACK_HOTEL_IMAGE}
          alt={hotel.name}
          className="w-full h-full object-cover bg-stone-200"
        />
      </div>

      {/* Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-1 mb-1">
                {Array.from({ length: hotel.starRating || 4 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h3 className="text-24 font-serif font-medium text-text">
                <Link to={detailUrl} className="hover:text-primary transition-colors">
                  {hotel.name}
                </Link>
              </h3>
            </div>

            {/* Rating */}
            <div className="text-right shrink-0">
              <div className="text-18 font-medium text-text">{hotel.avgRating || 4.5}</div>
              <div className="text-14 text-muted">{hotel.reviewCount || 0} reviews</div>
            </div>
          </div>

          <div className="flex items-center text-14 text-muted space-x-1 mb-3">
            <MapPin className="w-4 h-4" />
            <span>
              {hotel.area ? `${hotel.area}, ` : ''}
              {hotel.city}
            </span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-3">
            {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-14 text-muted"
              >
                {amenity}
              </span>
            ))}
          </div>

          {/* Cancellation badge */}
          <div className="mb-3">
            <span className="inline-block text-14 text-success bg-success/10 px-2 py-1 rounded">
              Free cancellation until 48 hours before check-in
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-border flex items-end justify-between">
          <div>
            <span className="text-14 text-muted block">Starting from</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-24 font-medium text-accent">
                ₹{hotel.startingPrice ? hotel.startingPrice.toLocaleString('en-IN') : '3,500'}
              </span>
              <span className="text-14 text-muted">/ night</span>
            </div>
            <span className="text-14 text-muted">+ taxes extra</span>
          </div>

          <Link
            to={detailUrl}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors"
          >
            <span className="text-16 font-medium">View rooms</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
