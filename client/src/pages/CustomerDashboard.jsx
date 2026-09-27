import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProfileCard from '../components/ProfileCard';
import BookingTable from '../components/BookingTable';
import FavoritesCarousel from '../components/FavoritesCarousel';

/**
 * Customer Dashboard – Shows profile overview, quick booking summary, and curated event shortcuts.
 */
function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, dashRes] = await Promise.all([
          API.get('/customer/profile'),
          API.get('/customer/dashboard')
        ]);
        setProfile(profileRes.data?.data);
        setBookings(dashRes.data?.data?.recentBookings || []);
        setFavorites(dashRes.data?.data?.favoriteEvents || []);
      } catch (err) {
        console.error('Customer dashboard load error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your customer dashboard...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>Failed to load profile details.</p>
        <Link to="/login" className="btn-primary">Sign In Again</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 5rem 1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-success" style={{ marginBottom: '0.4rem' }}>Attendee Dashboard</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.3rem)', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Welcome back, {profile.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your booked tickets, explore upcoming events, and access your profile.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/events" className="btn-primary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem' }}>
            🎪 Explore Events
          </Link>
          <Link 
            to="/my-bookings" 
            style={{
              padding: '0.55rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontWeight: '600',
              fontSize: '0.88rem'
            }}
          >
            🎟️ All Bookings
          </Link>
        </div>
      </div>

      {/* User Profile Card */}
      <ProfileCard user={profile} />

      {/* Recent Bookings Section */}
      <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: '700' }}>
            Recent Ticket Bookings
          </h2>
          <Link to="/my-bookings" style={{ color: 'var(--primary)', fontSize: '0.88rem', fontWeight: '600' }}>
            View Full History →
          </Link>
        </div>

        {bookings.length > 0 ? (
          <BookingTable bookings={bookings} />
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              You don't have any event bookings yet.
            </p>
            <Link to="/events" className="btn-primary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.88rem' }}>
              Browse Upcoming Events
            </Link>
          </div>
        )}
      </div>

      {/* Favorite Events Section */}
      <div className="glass-card">
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
          Favorite / Saved Events
        </h2>
        {favorites && favorites.length > 0 ? (
          <FavoritesCarousel events={favorites} />
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            You haven't bookmarked any events yet. Explore events and click the heart icon to save favorites for quick access.
          </p>
        )}
      </div>

    </div>
  );
}

export default CustomerDashboard;
