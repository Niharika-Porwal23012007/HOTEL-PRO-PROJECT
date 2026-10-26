import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-content mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-4">
            <span className="text-24 font-serif font-semibold text-primary">
              HotelPro
            </span>
            <p className="text-14 text-muted leading-relaxed">
              Thoughtful hotel bookings across India. Zero overbooking, honest reviews, and real-time availability.
            </p>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-16 font-serif font-medium text-text mb-4">Destinations</h4>
            <ul className="space-y-2 text-14 text-muted">
              <li><Link to="/hotels?city=Goa" className="hover:text-primary transition">Goa</Link></li>
              <li><Link to="/hotels?city=Mumbai" className="hover:text-primary transition">Mumbai</Link></li>
              <li><Link to="/hotels?city=Jaipur" className="hover:text-primary transition">Jaipur</Link></li>
              <li><Link to="/hotels?city=Delhi" className="hover:text-primary transition">Delhi</Link></li>
              <li><Link to="/hotels?city=Bengaluru" className="hover:text-primary transition">Bengaluru</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-16 font-serif font-medium text-text mb-4">Support</h4>
            <ul className="space-y-2 text-14 text-muted">
              <li><span className="hover:text-primary cursor-pointer">Cancellation Policy</span></li>
              <li><span className="hover:text-primary cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-primary cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-primary cursor-pointer">Contact Us</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-16 font-serif font-medium text-text mb-4">Company</h4>
            <ul className="space-y-2 text-14 text-muted">
              <li><span className="hover:text-primary cursor-pointer">About Us</span></li>
              <li><span className="hover:text-primary cursor-pointer">How It Works</span></li>
              <li><span className="hover:text-primary cursor-pointer">Careers</span></li>
              <li><span className="hover:text-primary cursor-pointer">Blog</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-14 text-muted">
          <p>© {new Date().getFullYear()} HotelPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
