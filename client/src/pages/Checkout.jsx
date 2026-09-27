import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TicketSelector from '../components/TicketSelector';
import { getEventDetailsById } from '../services/eventService';
import { createBookingApi } from '../services/bookingService';

/**
 * PAGE 6 & 7 — TICKET SELECTION & CHECKOUT PAGE
 * Handles tier selection, customer review, simulated payment gateway, and booking creation.
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
      try {
        const data = await getEventDetailsById(id);
        setEvent(data);
      } catch (err) {
        console.error('Checkout event fetch error:', err);
      } finally {
        setLoading(false);
      }
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
      setError('Mock Payment Failed: Simulated payment declined. Select "Payment Success" to complete order.');
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
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading checkout details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Event Not Found</h2>
        <Link to="/events" className="btn-primary" style={{ marginTop: '1rem' }}>Back to All Events</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem 5rem 1rem' }}>
      
      {/* Back Link */}
      <Link to={`/events/${id}`} style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
        ← Back to Event Details
      </Link>

      <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.3rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.75rem', letterSpacing: '-0.02em' }}>
        Event Ticket Checkout
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Ticket Selection & Customer Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Customer Details */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              👤 Customer Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700' }}>Name</span>
                <p style={{ fontWeight: '600', color: 'var(--text-main)', marginTop: '0.15rem' }}>{user?.name}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700' }}>Email</span>
                <p style={{ fontWeight: '600', color: 'var(--text-main)', marginTop: '0.15rem' }}>{user?.email}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700' }}>Phone</span>
                <p style={{ fontWeight: '600', color: 'var(--text-main)', marginTop: '0.15rem' }}>{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Ticket Selector */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem' }}>
              🎟️ Select Ticket Quantities
            </h3>
            <TicketSelector 
              ticketTypes={event.ticketTypes || []} 
              onSelectionChange={handleSelectionChange} 
            />
          </div>

          {/* Mock Payment Selector */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              💳 Payment Mode (Simulated Gateway)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Select payment simulation mode to test end-to-end checkout:
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <label style={{
                flex: '1 1 180px',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: mockPaymentState === 'success' ? 'var(--primary-light)' : 'var(--bg-input)',
                border: mockPaymentState === 'success' ? '1px solid var(--primary)' : '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-main)'
              }}>
                <input 
                  type="radio"
                  name="paymentMode"
                  value="success"
                  checked={mockPaymentState === 'success'}
                  onChange={() => setMockPaymentState('success')}
                />
                <span>✅ Payment Success</span>
              </label>

              <label style={{
                flex: '1 1 180px',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: mockPaymentState === 'failure' ? 'var(--error-bg)' : 'var(--bg-input)',
                border: mockPaymentState === 'failure' ? '1px solid var(--error)' : '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-main)'
              }}>
                <input 
                  type="radio"
                  name="paymentMode"
                  value="failure"
                  checked={mockPaymentState === 'failure'}
                  onChange={() => setMockPaymentState('failure')}
                />
                <span>❌ Simulate Failure</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="glass-card" style={{ position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem' }}>
            📋 Booking Summary
          </h3>

          {/* Event Mini Info */}
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <h4 style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              {event.title}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📅 {event.startDate} • {event.startTime}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📍 {event.venue}, {event.city}</p>
          </div>

          {/* Selected Item Breakdown */}
          {selection.selectedTickets.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {selection.selectedTickets.map((t, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t.name} (x{t.quantity})</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>₹{t.price * t.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
              No tickets selected yet. Use the selector on the left to add tickets.
            </p>
          )}

          {/* Total Calculation */}
          <div style={{
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem'
          }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Total Amount</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{selection.totalQty} Ticket(s)</p>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
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
              padding: '0.8rem',
              fontSize: '0.98rem'
            }}
          >
            {isSubmitting ? 'Processing Payment...' : 'Confirm & Reserve Tickets'}
          </button>
        </div>

      </div>

    </div>
  );
}

export default Checkout;
