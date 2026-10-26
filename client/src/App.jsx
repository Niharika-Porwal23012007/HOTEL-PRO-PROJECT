import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { HotelSearchPage } from './pages/HotelSearchPage';
import { HotelDetailsPage } from './pages/HotelDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { StaffDashboardPage } from './pages/StaffDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelSearchPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route
            path="/checkout/:bookingId"
            element={
              <ProtectedRoute allowedRoles={['guest', 'staff', 'admin']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmation/:id"
            element={
              <ProtectedRoute allowedRoles={['guest', 'staff', 'admin']}>
                <BookingConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={['guest', 'staff', 'admin']}>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['guest', 'staff', 'admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
