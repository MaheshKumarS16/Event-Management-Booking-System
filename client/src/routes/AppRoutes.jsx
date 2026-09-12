import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Checkout from '../pages/Checkout';
import BookingConfirmation from '../pages/BookingConfirmation';
import MyBookings from '../pages/MyBookings';
import BookingDetails from '../pages/BookingDetails';
import OrganizerDashboard from '../pages/OrganizerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import CustomerDashboard from '../pages/CustomerDashboard';
import ProtectedRoute from './ProtectedRoute';

/**
 * Application Routing Module
 *
 * Concept Explanation:
 * - What it is: A React Router component mapping URL paths to page views.
 * - Why we need it: Enables single-page application (SPA) client-side navigation and protected routes.
 * - Where we use it: Embedded in App.jsx.
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Protected Booking Routes */}
      <Route
        path="/events/:id/checkout"
        element={
          <ProtectedRoute allowedRoles={['customer', 'organizer', 'admin']}>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking-confirmation"
        element={
          <ProtectedRoute allowedRoles={['customer', 'organizer', 'admin']}>
            <BookingConfirmation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute allowedRoles={['customer', 'organizer', 'admin']}>
            <MyBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bookings/:id"
        element={
          <ProtectedRoute allowedRoles={['customer', 'organizer', 'admin']}>
            <BookingDetails />
          </ProtectedRoute>
        }
      />

      {/* Organizer Dashboard */}
      <Route
        path="/organizer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Customer Dashboard */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['customer', 'organizer', 'admin']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
