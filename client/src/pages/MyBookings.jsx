import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookingsApi, cancelBookingApi } from '../services/bookingService';

/**
 * PAGE 9 — MY BOOKINGS PAGE
 * 
 * Concept Explanation:
 * - What it is: Customer dashboard page listing past and upcoming ticket reservations.
 * - Why we need it: Allows customers to track their booking status and initiate ticket cancellations.
 * - Where we use it: Mounted at route path '/my-bookings'.
 */
function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Confirmed', 'Cancelled'
  const [actionNotice, setActionNotice] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getUserBookingsApi();
      if (response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Ticket availability will be restored.')) {
      return;
    }

    try {
      const response = await cancelBookingApi(bookingId);
      if (response.success) {
        setActionNotice('Booking cancelled successfully and ticket availability restored.');
        fetchBookings();
      }
    } catch (error) {
      setActionNotice(error.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'Confirmed') return b.bookingStatus === 'Confirmed';
    if (activeTab === 'Cancelled') return b.bookingStatus === 'Cancelled';
    return true;
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f8fafc' }}>
          My Bookings & Tickets
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          View your confirmed ticket reservations, event details, and manage cancellations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        {['All', 'Confirmed', 'Cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: activeTab === tab ? 'var(--primary)' : 'var(--bg-card)',
              color: '#f8fafc',
              fontWeight: activeTab === tab ? '700' : '500',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {tab === 'All' ? 'All Bookings' : tab}
          </button>
        ))}
      </div>

      {actionNotice && (
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 'var(--radius-md)', color: '#f8fafc', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          💡 {actionNotice}
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading your booking history...</p>
      ) : filteredBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredBookings.map(b => {
            const isConfirmed = b.bookingStatus === 'Confirmed';
            const eventTitle = b.event?.title || 'Event Record';
            const venue = b.event?.venue || '';
            const city = b.event?.city || '';
            const startDate = b.event?.startDate || '';

            return (
              <div key={b._id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                      Booking ID
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                      {b.bookingId}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${isConfirmed ? 'badge-success' : 'badge-error'}`}>
                      {b.bookingStatus}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Booked on: {new Date(b.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.3rem' }}>
                      {eventTitle}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>📅 {startDate}</p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>📍 {venue}, {city}</p>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                      Reserved Tickets
                    </span>
                    {b.tickets.map((t, idx) => (
                      <p key={idx} style={{ fontSize: '0.88rem', color: '#f8fafc' }}>
                        • {t.name} (x{t.quantity}) @ ₹{t.price}
                      </p>
                    ))}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', display: 'block' }}>
                      Total Amount
                    </span>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc' }}>
                      ₹{b.totalAmount}
                    </span>

                    <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <Link 
                        to={`/bookings/${b._id}`}
                        style={{
                          padding: '0.45rem 0.9rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          color: '#f8fafc',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}
                      >
                        View Details
                      </Link>

                      {isConfirmed && (
                        <button
                          onClick={() => handleCancelBooking(b._id)}
                          style={{
                            padding: '0.45rem 0.9rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--error-bg)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: 'var(--error)',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🎟️</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#f8fafc' }}>
            No Bookings Found
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            You haven't booked any events yet. Explore upcoming events to reserve your tickets!
          </p>
          <Link to="/events" className="btn-primary">
            Explore Events
          </Link>
        </div>
      )}

    </div>
  );
}

export default MyBookings;
