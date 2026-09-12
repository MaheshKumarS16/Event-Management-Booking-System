import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

/**
 * PAGE 8 — BOOKING CONFIRMATION PAGE
 * 
 * Concept Explanation:
 * - What it is: Post-checkout confirmation view displaying confirmed Booking ID, ticket breakdown, and payment status.
 * - Why we need it: Provides visual receipt of successful transaction.
 * - Where we use it: Mounted at route path '/booking-confirmation'.
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
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '650px', padding: '2.5rem', textAlign: 'center' }}>
        
        {/* Success Icon */}
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: 'var(--success-bg)',
          border: '2px solid var(--success)',
          color: 'var(--success)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.2rem',
          marginBottom: '1.25rem'
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.4rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Thank you for your order. Your tickets have been reserved successfully.
        </p>

        {/* Booking Reference Box */}
        <div style={{
          backgroundColor: 'var(--bg-dark)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1px dashed var(--primary)',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Booking Reference ID</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                {booking.bookingId}
              </h3>
            </div>
            <span className="badge badge-success">Status: Confirmed</span>
          </div>

          {/* Event & Schedule Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.88rem', marginBottom: '1rem' }}>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Event Title:</strong>
              <p style={{ color: '#f8fafc', fontWeight: '600' }}>{eventTitle}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Date & Time:</strong>
              <p style={{ color: '#f8fafc', fontWeight: '600' }}>{startDate}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Venue:</strong>
              <p style={{ color: '#f8fafc', fontWeight: '600' }}>{venue}, {city}</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Payment Status:</strong>
              <p style={{ color: 'var(--success)', fontWeight: '700' }}>{booking.paymentStatus} (Mock)</p>
            </div>
          </div>

          {/* Itemized Tickets Table */}
          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', display: 'block', marginBottom: '0.5rem' }}>
              Purchased Tickets
            </span>
            {booking.tickets?.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t.name} (x{t.quantity})</span>
                <span style={{ color: '#f8fafc', fontWeight: '600' }}>₹{t.price * t.quantity}</span>
              </div>
            ))}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: '800', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ color: '#f8fafc' }}>Total Paid:</span>
              <span style={{ color: 'var(--primary)' }}>₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/my-bookings" className="btn-primary" style={{ padding: '0.75rem 1.8rem' }}>
            View My Bookings
          </Link>
          <Link to="/events" style={{
            padding: '0.75rem 1.8rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            fontWeight: '600',
            color: '#f8fafc'
          }}>
            Explore More Events
          </Link>
        </div>

      </div>

    </div>
  );
}

export default BookingConfirmation;
