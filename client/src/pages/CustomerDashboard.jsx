import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ProfileCard from '../components/ProfileCard';
import BookingTable from '../components/BookingTable';
import FavoritesCarousel from '../components/FavoritesCarousel';

/**
 * Customer Dashboard – shows profile, recent bookings, favorite events, and upcoming events.
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
        setProfile(profileRes.data.data);
        setBookings(dashRes.data.data.recentBookings);
        setFavorites(dashRes.data.data.favoriteEvents);
      } catch (err) {
        console.error('Customer dashboard load error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>;
  if (!profile) return <p style={{ color: 'var(--error)' }}>Failed to load profile.</p>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ color: '#f8fafc', marginBottom: '1.5rem' }}>Customer Dashboard</h1>
      <ProfileCard user={profile} />

      <h2 style={{ color: '#f8fafc', marginTop: '2rem' }}>Recent Bookings</h2>
      <BookingTable bookings={bookings} />

      <h2 style={{ color: '#f8fafc', marginTop: '2rem' }}>Favorite Events</h2>
      {favorites.length > 0 ? (
        <FavoritesCarousel events={favorites} />
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>You have no favorite events yet.</p>
      )}
    </div>
  );
}

export default CustomerDashboard;
