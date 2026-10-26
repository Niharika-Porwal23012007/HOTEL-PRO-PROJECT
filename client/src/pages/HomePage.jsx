import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HotelCard } from '../components/HotelCard';
import { SafeImage } from '../components/SafeImage';
import { ArrowRight, MapPin, Shield, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';

export const HomePage = () => {
  const navigate = useNavigate();
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/hotels/featured');
        setFeaturedHotels(res.data?.data?.featured || []);
        setDestinations(res.data?.data?.destinations || []);
      } catch (err) {
        console.error('Error loading featured data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/hotels?city=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-content mx-auto">
          <div className="relative h-[700px]">
            <SafeImage
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
              alt="Lake Palace at golden hour"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="max-w-content mx-auto">
                <div className="bg-surface/95 backdrop-blur-sm p-8 md:p-10 rounded-card shadow-2xl max-w-3xl">
                  <h1 className="text-48 md:text-56 font-serif font-medium text-text mb-3">
                    Find your perfect stay
                  </h1>
                  <p className="text-18 text-muted mb-8">
                    Thoughtful hotel bookings across India's most beautiful destinations
                  </p>
                  <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Where do you want to go?"
                        className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-input text-16 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-primary text-surface rounded-input hover:bg-primary-hover transition-colors text-16 font-medium"
                    >
                      Search hotels
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="max-w-content mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4 p-6 bg-surface rounded-card border border-border">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-18 font-serif font-medium text-text mb-2">
                Zero overbooking
              </h3>
              <p className="text-14 text-muted">
                Our booking engine guarantees you'll never face double-booking issues
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-6 bg-surface rounded-card border border-border">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-18 font-serif font-medium text-text mb-2">
                10-minute price hold
              </h3>
              <p className="text-14 text-muted">
                Lock your room and price while you complete your booking
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-6 bg-surface rounded-card border border-border">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-18 font-serif font-medium text-text mb-2">
                Free cancellation
              </h3>
              <p className="text-14 text-muted">
                Cancel up to 48 hours before check-in for a full refund
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stays people book again */}
      <section className="max-w-content mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-32 font-serif font-medium text-text mb-2">
              Stays people book again
            </h2>
            <p className="text-16 text-muted">
              Properties our guests return to, year after year
            </p>
          </div>
          <Link
            to="/hotels"
            className="hidden md:flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors"
          >
            <span className="text-16 font-medium">View all</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
          {featuredHotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} compact />
          ))}
        </div>
      </section>

      {/* Destinations - Asymmetric Grid */}
      <section className="max-w-content mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-32 font-serif font-medium text-text mb-2">
            Explore destinations
          </h2>
          <p className="text-16 text-muted">
            From quiet hills to vibrant cities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large image */}
          <div className="md:col-span-2 md:row-span-2">
            <Link
              to="/hotels?city=Goa"
              className="relative h-96 md:h-auto rounded-card overflow-hidden group block"
            >
              <SafeImage
                src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
                alt="Goa"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-32 font-serif font-medium mb-1">Goa</h3>
                <p className="text-16">18 properties</p>
              </div>
            </Link>
          </div>
          
          {/* Small images */}
          {destinations.slice(1, 5).map((dest, i) => (
            <Link
              key={i}
              to={`/hotels?city=${encodeURIComponent(dest.city)}`}
              className="relative h-48 rounded-card overflow-hidden group block"
            >
              <SafeImage
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover bg-stone-300 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-18 font-serif font-medium mb-1">{dest.city}</h3>
                <p className="text-14">{dest.count} properties</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How booking works */}
      <section className="max-w-content mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-32 font-serif font-medium text-text mb-2">
            How booking works
          </h2>
          <p className="text-16 text-muted">
            Three simple steps to your perfect stay
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-primary text-surface rounded-full flex items-center justify-center text-32 font-serif font-medium">
              1
            </div>
            <h3 className="text-24 font-serif font-medium text-text">
              Search and compare
            </h3>
            <p className="text-16 text-muted leading-relaxed">
              Find hotels by location, dates, and amenities. Filter by price, rating, and more to find exactly what you need.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="w-16 h-16 bg-primary text-surface rounded-full flex items-center justify-center text-32 font-serif font-medium">
              2
            </div>
            <h3 className="text-24 font-serif font-medium text-text">
              Book securely
            </h3>
            <p className="text-16 text-muted leading-relaxed">
              Reserve your room with a 10-minute price hold. Pay securely with our test mode integration.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="w-16 h-16 bg-primary text-surface rounded-full flex items-center justify-center text-32 font-serif font-medium">
              3
            </div>
            <h3 className="text-24 font-serif font-medium text-text">
              Stay and review
            </h3>
            <p className="text-16 text-muted leading-relaxed">
              Enjoy your stay. Leave a review after checkout to help others choose better.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-content mx-auto px-4">
        <div className="bg-primary p-16 rounded-card text-surface text-center">
          <h2 className="text-40 font-serif font-medium mb-4">
            Ready to book your next stay?
          </h2>
          <p className="text-18 mb-8 max-w-2xl mx-auto">
            Browse our curated collection of hotels across India's most beautiful destinations
          </p>
          <Link
            to="/hotels"
            className="inline-flex items-center space-x-2 bg-surface text-primary px-8 py-4 rounded-input hover:bg-background transition-colors text-16 font-medium"
          >
            <span>Explore hotels</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
