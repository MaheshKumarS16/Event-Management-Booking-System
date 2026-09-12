import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TicketSelector from '../components/TicketSelector';
import { getEventDetailsById } from '../services/eventService';
import { createBookingApi } from '../services/bookingService';

/**
 * PAGE 6 & 7 — TICKET SELECTION & CHECKOUT PAGE
 * 
 * Concept Explanation:
 * - What it is: Checkout page where customer selects ticket quantities, reviews order breakdown, and completes mock payment.
 * - Why we need it: Connects frontend selection to backend POST /api/bookings endpoint.
 * - Where we use it: Mounted at route path '/events/:id/checkout'.
 */
function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState({ selectedTickets: [], grandTotal: 0, totalQty: 0 });
  const [mockPaymentState, setMockPaymentState] = useState('success'); // 'success' or 'failure'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const data = await getEventDetailsById(id);
      setEvent(data);
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  const handleSelectionChange = (data) => {
    setSelection(data);
    setError('');
  };

  const handleCompleteBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (selection.totalQty <= 0) {
      setError('Please select at least 1 ticket to proceed.');
      return;
    }

    if (mockPaymentState === 'failure') {
      setError('Mock Payment Failed: Simulated payment declined. Please try again with Success state selected.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createBookingApi(event._id || event.id, selection.selectedTickets, 'Mock Gateway');
      setIsSubmitting(false);

      if (response.success) {
        navigate('/booking-confirmation', { state: { booking: response.data } });
      } else {
        setError(response.message || 'Booking failed');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Booking failed due to server error');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading checkout details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: '#f8fafc' }}>Event Not Found</h2>
        <Link to="/events" className="btn-primary" style={{ marginTop: '1rem' }}>Back to All Events</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
      
      {/* Back Link */}
      <Link to={`/events/${id}`} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
        ← Back to Event Details
      </Link>

      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f8fafc', marginBottom: '2rem' }}>
        Event Ticket Checkout
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Ticket Selection & Customer Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Customer Details */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem' }}>
              👤 Customer Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Name</span>
                <p style={{ fontWeight: '600', color: '#f8fafc' }}>{user?.name}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Email</span>
                <p style={{ fontWeight: '600', color: '#f8fafc' }}>{user?.email}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '700' }}>Phone</span>
                <p style={{ fontWeight: '600', color: '#f8fafc' }}>{user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Ticket Selector */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1.25rem' }}>
              🎟️ Select Ticket Quantities
            </h3>
            <TicketSelector 
              ticketTypes={event.ticketTypes} 
              onSelectionChange={handleSelectionChange} 
            />
          </div>

          {/* Mock Payment Selector */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.75rem' }}>
              💳 Payment Options (Mock Gateway)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Version 1 uses simulated payment processing. Choose payment outcome to test logic:
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: mockPaymentState === 'success' ? 'var(--primary-light)' : 'var(--bg-dark)',
                border: mockPaymentState === 'success' ? '1px solid var(--primary)' : '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#f8fafc'
              }}>
                <input 
                  type="radio"
                  name="paymentMode"
                  value="success"
                  checked={mockPaymentState === 'success'}
                  onChange={() => setMockPaymentState('success')}
                />
                ✅ Mock Payment Success
              </label>

              <label style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: mockPaymentState === 'failure' ? 'var(--error-bg)' : 'var(--bg-dark)',
                border: mockPaymentState === 'failure' ? '1px solid var(--error)' : '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#f8fafc'
              }}>
                <input 
                  type="radio"
                  name="paymentMode"
                  value="failure"
                  checked={mockPaymentState === 'failure'}
                  onChange={() => setMockPaymentState('failure')}
                />
                ❌ Mock Payment Fail
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="glass-card" style={{ position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1.25rem' }}>
            📋 Booking Summary
          </h3>

          {/* Event Mini Info */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <h4 style={{ color: '#f8fafc', fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.3rem' }}>
              {event.title}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 {event.startDate} • {event.startTime}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {event.venue}, {event.city}</p>
          </div>

          {/* Selected Item Breakdown */}
          {selection.selectedTickets.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selection.selectedTickets.map((t, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t.name} (x{t.quantity})</span>
                  <span style={{ fontWeight: '700', color: '#f8fafc' }}>₹{t.price * t.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
              No tickets selected yet. Use the selector to add tickets.
            </p>
          )}

          {/* Total Calculation */}
          <div style={{
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount</span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{selection.totalQty} Ticket(s)</p>
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>
              ₹{selection.grandTotal}
            </span>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleCompleteBooking}
            disabled={isSubmitting || selection.totalQty <= 0}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1rem',
              opacity: (isSubmitting || selection.totalQty <= 0) ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Processing Payment...' : 'Confirm & Book Now'}
          </button>
        </div>

      </div>

    </div>
  );
}

export default Checkout;
