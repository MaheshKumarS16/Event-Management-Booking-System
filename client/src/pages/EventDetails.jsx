import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_EVENTS } from '../utils/mockData';

/**
 * PAGE 3 — EVENT DETAILS PAGE
 * 
 * Concept Explanation:
 * - What it is: Detailed view for a single selected event.
 * - Why we need it: Displays comprehensive event schedule, venue address, organizer info, ticket pricing breakdown, and booking entry point.
 * - Where we use it: Mounted at route path '/events/:id'.
 */
function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find target event in dataset
  const event = MOCK_EVENTS.find(e => e.id === id) || MOCK_EVENTS[0];

  const totalAvailable = event.totalCapacity - event.soldTickets;
  const isBookable = event.status === 'Published' && totalAvailable > 0;

  const [bookingNotice, setBookingNotice] = useState(null);

  const handleBookClick = () => {
    if (!isBookable) return;
    setBookingNotice('Ticket selection logic will be enabled in Phase 6 (Booking & Ticket Selection)!');
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
      
      {/* Back Link */}
      <Link to="/events" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
        ← Back to All Events
      </Link>

      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        height: '340px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '2.5rem',
        border: '1px solid var(--border)'
      }}>
        <img 
          src={event.image} 
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-success">{event.category}</span>
            <span className={`badge ${event.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>
              Status: {event.status}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', color: '#f8fafc', lineHeight: '1.2' }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Grid Layout: Main Info & Booking Sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Event Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Description */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem' }}>
              About This Event
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>

          {/* Date, Time & Venue Specs */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1.25rem' }}>
              Date, Time & Location
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  📅 Event Dates
                </span>
                <p style={{ color: '#f8fafc', fontWeight: '600', marginTop: '0.2rem' }}>
                  {event.startDate} to {event.endDate}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  ⏰ Schedule
                </span>
                <p style={{ color: '#f8fafc', fontWeight: '600', marginTop: '0.2rem' }}>
                  {event.startTime} - {event.endTime}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  📍 Venue Name
                </span>
                <p style={{ color: '#f8fafc', fontWeight: '600', marginTop: '0.2rem' }}>
                  {event.venue}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  🏢 City & Address
                </span>
                <p style={{ color: '#f8fafc', fontWeight: '600', marginTop: '0.2rem' }}>
                  {event.address}, {event.city}
                </p>
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: '800'
            }}>
              🎪
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                Hosted By
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
                {event.organizer}
              </h4>
            </div>
          </div>

        </div>

        {/* Right Column: Ticket Tiers & Booking Action Sidebar */}
        <div className="glass-card" style={{ position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
            Select Tickets
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Choose your preferred ticket tier below:
          </p>

          {/* Ticket Tiers Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
            {event.ticketTypes.map(ticket => {
              const tierAvailable = ticket.quantity - ticket.soldQuantity;
              return (
                <div 
                  key={ticket.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-dark)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ color: '#f8fafc', fontWeight: '700', fontSize: '1rem' }}>{ticket.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {tierAvailable > 0 ? `${tierAvailable} remaining` : 'Sold Out'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                      ₹{ticket.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seat Capacity Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Ticket Availability</span>
              <span style={{ fontWeight: '700', color: totalAvailable > 0 ? 'var(--success)' : 'var(--error)' }}>
                {totalAvailable} / {event.totalCapacity} Seats Available
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(event.soldTickets / event.totalCapacity) * 100}%`,
                backgroundColor: 'var(--primary)'
              }}></div>
            </div>
          </div>

          {/* Notice alert */}
          {bookingNotice && (
            <div style={{
              padding: '0.85rem',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: '#f8fafc',
              marginBottom: '1rem'
            }}>
              💡 {bookingNotice}
            </div>
          )}

          {/* Primary Action Button */}
          <button 
            onClick={handleBookClick}
            disabled={!isBookable}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1rem',
              opacity: isBookable ? 1 : 0.5,
              cursor: isBookable ? 'pointer' : 'not-allowed'
            }}
          >
            {isBookable ? 'Book Now' : 'Booking Unavailable'}
          </button>

          {!isBookable && (
            <p style={{ fontSize: '0.78rem', color: 'var(--error)', textAlign: 'center', marginTop: '0.6rem' }}>
              This event is either completed, cancelled, or sold out.
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default EventDetails;
