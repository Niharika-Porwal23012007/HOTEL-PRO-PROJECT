import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HotelCard } from '../components/HotelCard';
import { SlidersHorizontal, Star, Loader2, AlertCircle, RotateCcw, MapPin } from 'lucide-react';
import api from '../services/api';

export const HotelSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

  // Filters state from URL query
  const city = searchParams.get('city') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '2';
  const rooms = searchParams.get('rooms') || '1';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'recommended';
  const starRating = searchParams.get('starRating') || '';
  const amenities = searchParams.get('amenities') || '';
  const propertyType = searchParams.get('propertyType') || '';

  const [selectedAmenities, setSelectedAmenities] = useState(
    amenities ? amenities.split(',') : []
  );

  const availableAmenities = [
    'Swimming Pool',
    'Spa',
    'Free WiFi',
    'Restaurant',
    'Pet Friendly',
    'Free Parking',
    'Gym',
    'Beachfront',
  ];

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await api.get('/hotels', { params: Object.fromEntries(searchParams) });
        setHotels(res.data?.data || []);
        setMeta(res.data?.meta || { total: 0, page: 1, totalPages: 1 });
      } catch (err) {
        console.error('Failed to load hotels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleAmenityToggle = (amenity) => {
    let updated;
    if (selectedAmenities.includes(amenity)) {
      updated = selectedAmenities.filter((a) => a !== amenity);
    } else {
      updated = [...selectedAmenities, amenity];
    }
    setSelectedAmenities(updated);
    updateParam('amenities', updated.length > 0 ? updated.join(',') : '');
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (city) newParams.set('city', city);
    if (checkIn) newParams.set('checkIn', checkIn);
    if (checkOut) newParams.set('checkOut', checkOut);
    if (guests) newParams.set('guests', guests);
    if (rooms) newParams.set('rooms', rooms);
    setSelectedAmenities([]);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-40 font-serif font-medium text-text mb-2">
          {city ? `Hotels in ${city}` : 'Search hotels'}
        </h1>
        <p className="text-16 text-muted">
          {meta.total} properties found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-surface p-6 rounded-card border border-border space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h3 className="text-18 font-serif font-medium text-text">Filters</h3>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-14 text-primary hover:text-primary-hover flex items-center space-x-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Star Rating Filter */}
            <div>
              <label className="text-14 font-medium text-text block mb-3">
                Star Rating
              </label>
              <div className="flex gap-2">
                {[5, 4, 3].map((star) => (
                  <button
                    key={star}
                    onClick={() => updateParam('starRating', starRating === star.toString() ? '' : star.toString())}
                    className={`flex-1 py-2 rounded-input border text-14 font-medium flex items-center justify-center space-x-1 transition ${
                      starRating === star.toString()
                        ? 'bg-primary text-surface border-primary'
                        : 'bg-background border-border text-text hover:border-primary'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span>{star}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-14 font-medium text-text block mb-3">
                Max Price / Night (₹)
              </label>
              <input
                type="range"
                min="2000"
                max="20000"
                step="500"
                value={maxPrice || '20000'}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-14 text-muted mt-2">
                <span>₹2,000</span>
                <span className="text-primary font-medium">
                  {maxPrice ? `₹${Number(maxPrice).toLocaleString('en-IN')}` : 'All prices'}
                </span>
                <span>₹20,000+</span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="text-14 font-medium text-text block mb-3">
                Amenities
              </label>
              <div className="space-y-2">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-3 text-14 text-text cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-border text-primary focus:ring-primary w-5 h-5"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="text-14 font-medium text-text block mb-3">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => updateParam('propertyType', e.target.value)}
                className="w-full bg-background border border-border text-14 p-3 rounded-input text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All types</option>
                <option value="hotel">Hotel</option>
                <option value="resort">Resort</option>
                <option value="villa">Luxury Villa</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Column */}
        <main className="lg:col-span-3 space-y-6">
          {/* Sorting */}
          <div className="flex items-center justify-between bg-surface p-4 rounded-card border border-border">
            <div className="flex items-center space-x-2 text-14 text-muted">
              <MapPin className="w-4 h-4" />
              <span>{city || 'All locations'}</span>
            </div>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-background border border-border text-14 p-2 rounded-input text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rating</option>
            </select>
          </div>

          {/* Hotel Cards List */}
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4 bg-surface rounded-card border border-border">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-16 text-muted">Searching available hotels...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="p-12 text-center bg-surface rounded-card border border-border space-y-4">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto text-muted">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-24 font-serif font-medium text-text">No properties found</h3>
              <p className="text-16 text-muted max-w-md mx-auto">
                Try adjusting your filters or search criteria to find more options.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors text-16 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  searchParams={{ city, checkIn, checkOut, guests, rooms }}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
