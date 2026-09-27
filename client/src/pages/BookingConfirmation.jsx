import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

/**
 * PAGE 8 — BOOKING CONFIRMATION PAGE
 * Visual receipt of confirmed ticket transaction.
 */
function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/events" replace />;
  }

  const eventTitle = booking.event?.title || 'Confirmed Event';
  const venue = booking.event?.venue || 'Venue Location';
  const city = booking.event?.city || '';
  const startDate = booking.event?.startDate || '';

  return (
    <div className="container" style={{ padding: '3rem 1rem 5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '620px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', textAlign: 'center' }}>
        
        {/* Success Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--success-bg)',
          border: '2px solid var(--success)',
          color: 'var(--success)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          marginBottom: '1rem'
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
          Thank you for your order. Your tickets have been reserved successfully.
        </p>

        {/* Booking Reference Box */}
        <div style={{
          backgroundColor: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1px dashed var(--primary)',
          marginBottom: '1.75rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Booking Reference ID</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.04em' }}>
                {booking.bookingId}
              </h3>
            </div>
            <span className="badge badge-success">Confirmed</span>
          </div>

          {/* Event & Schedule Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '0.85rem', fontSize: '0.88rem', marginBottom: '1rem' }}>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Event Title:</strong>
              <p style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '0.15rem' }}>{eventTitle}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Date & Time:</strong>
              <p style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '0.15rem' }}>{startDate}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Venue:</strong>
              <p style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '0.15rem' }}>{venue}, {city}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Payment:</strong>
              <p style={{ color: 'var(--success)', fontWeight: '700', marginTop: '0.15rem' }}>{booking.paymentStatus} (Mock)</p>
            </div>
          </div>

          {/* Itemized Tickets Table */}
          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', display: 'block', marginBottom: '0.5rem' }}>
              Purchased Tickets
            </span>
            {booking.tickets?.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t.name} (x{t.quantity})</span>
                <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>₹{t.price * t.quantity}</span>
              </div>
            ))}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '800', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-main)' }}>Total Paid:</span>
              <span style={{ color: 'var(--primary)' }}>₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/my-bookings" className="btn-primary" style={{ padding: '0.65rem 1.6rem' }}>
            View My Bookings
          </Link>
          <Link to="/events" style={{
            padding: '0.65rem 1.6rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            fontWeight: '600',
            color: 'var(--text-main)',
            backgroundColor: 'var(--bg-card)'
          }}>
            Explore More Events
          </Link>
        </div>

      </div>

    </div>
  );
}

export default BookingConfirmation;
