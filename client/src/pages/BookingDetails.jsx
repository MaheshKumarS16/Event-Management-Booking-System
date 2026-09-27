/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingByIdApi, cancelBookingApi } from '../services/bookingService';

/**
 * PAGE 10 — BOOKING DETAILS PAGE
 * Itemized single booking record view with cancellation option and printable ticket view.
 */
function BookingDetails() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getBookingByIdApi(id);
      if (response.data) {
        setBooking(response.data);
      }
    } catch (error) {
      console.error('Fetch booking error:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await cancelBookingApi(booking._id);
      if (response.success) {
        setActionNotice('Booking cancelled successfully and ticket availability restored.');
        fetchBooking();
      }
    } catch (error) {
      setActionNotice(error.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading booking record...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Booking Not Found</h2>
        <Link to="/my-bookings" className="btn-primary">Back to My Bookings</Link>
      </div>
    );
  }

  const isConfirmed = booking.bookingStatus === 'Confirmed';
  const eventTitle = booking.event?.title || 'Event Record';
  const venue = booking.event?.venue || '';
  const city = booking.event?.city || '';
  const startDate = booking.event?.startDate || '';

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '720px' }}>
        
        {/* Back Link */}
        <Link to="/my-bookings" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
          ← Back to My Bookings
        </Link>

        {actionNotice && (
          <div style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            💡 {actionNotice}
          </div>
        )}

        <div className="glass-card" style={{ padding: 'clamp(1.25rem, 3.5vw, 2.25rem)' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Official Booking Reference</span>
              <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', fontWeight: '800', color: 'var(--primary)' }}>
                {booking.bookingId}
              </h1>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${isConfirmed ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.85rem' }}>
                {booking.bookingStatus}
              </span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Booked on {new Date(booking.bookingDate).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Event Specs */}
          <div style={{ backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              🎪 {eventTitle}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Date & Time:</strong>
                <p style={{ color: 'var(--text-main)', marginTop: '0.15rem' }}>{startDate}</p>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Location:</strong>
                <p style={{ color: 'var(--text-main)', marginTop: '0.15rem' }}>{venue}, {city}</p>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Payment Method:</strong>
                <p style={{ color: 'var(--success)', fontWeight: '600', marginTop: '0.15rem' }}>{booking.paymentStatus} (Mock)</p>
              </div>
            </div>
          </div>

          {/* Purchased Tickets Breakdown */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              🎟️ Purchased Ticket Tiers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {booking.tickets?.map((t, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>{t.name}</strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>(Qty: {t.quantity})</span>
                  </div>
                  <span style={{ color: 'var(--primary)', fontWeight: '700' }}>₹{t.price * t.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)', marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>Total Paid Amount:</span>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>
              ₹{booking.totalAmount}
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/my-bookings" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              ← Return to My Bookings List
            </Link>

            {isConfirmed && (
              <button
                onClick={handleCancelBooking}
                style={{
                  padding: '0.6rem 1.3rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--error-bg)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: 'var(--error)',
                  fontSize: '0.88rem',
                  fontWeight: '700'
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
}

export default BookingDetails;
