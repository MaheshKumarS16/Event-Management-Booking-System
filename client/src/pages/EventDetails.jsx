import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEventDetailsById } from '../services/eventService';

/**
 * PAGE 3 — EVENT DETAILS PAGE
 * Comprehensive view of event schedule, venue specs, organizer info, ticket pricing, and booking entry point.
 */
function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await getEventDetailsById(id);
        setEvent(data);
      } catch (err) {
        console.error('Fetch event details error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Event Not Found</h2>
        <Link to="/events" className="btn-primary">Back to All Events</Link>
      </div>
    );
  }

  const categoryName = typeof event.category === 'object' ? event.category?.name : (event.category || 'General');
  const organizerName = typeof event.organizer === 'object' ? event.organizer?.name : (event.organizer || 'Event Organizer');

  const ticketTiers = event.ticketTypes || [];
  const totalCapacity = event.totalCapacity || ticketTiers.reduce((acc, t) => acc + (t.quantity || 0), 0);
  const soldTickets = event.soldTickets !== undefined ? event.soldTickets : ticketTiers.reduce((acc, t) => acc + (t.soldQuantity || 0), 0);
  const totalAvailable = Math.max(0, totalCapacity - soldTickets);

  const isBookable = (event.status === 'Published' || !event.status) && totalAvailable > 0;

  const handleBookClick = () => {
    if (!isBookable) return;
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}/checkout` } } });
      return;
    }
    navigate(`/events/${id}/checkout`);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem 5rem 1rem' }}>
      
      {/* Back Link */}
      <Link to="/events" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
        ← Back to All Events
      </Link>

      {/* Hero Banner */}
      <div style={{
        position: 'relative',
        height: 'clamp(240px, 35vw, 360px)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '2rem',
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
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.3) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(1rem, 3vw, 2rem)'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
            <span className="badge badge-success">{categoryName}</span>
            <span className={`badge ${event.status === 'Published' || !event.status ? 'badge-success' : 'badge-warning'}`}>
              Status: {event.status || 'Published'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: '800', color: '#ffffff', lineHeight: '1.2' }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Grid Layout: Main Info & Booking Sidebar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Event Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Description */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              About This Event
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>

          {/* Date, Time & Venue Specs */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem' }}>
              Date, Time & Location
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  📅 Event Dates
                </span>
                <p style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '0.2rem' }}>
                  {event.startDate} {event.endDate && event.endDate !== event.startDate ? `to ${event.endDate}` : ''}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  ⏰ Schedule
                </span>
                <p style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '0.2rem' }}>
                  {event.startTime} - {event.endTime || 'Wrap'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  📍 Venue Name
                </span>
                <p style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '0.2rem' }}>
                  {event.venue}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  🏢 City & Address
                </span>
                <p style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '0.2rem' }}>
                  {event.address}, {event.city}
                </p>
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              fontWeight: '800',
              flexShrink: 0
            }}>
              🎪
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                Hosted By
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>
                {organizerName}
              </h4>
            </div>
          </div>

        </div>

        {/* Right Column: Ticket Tiers & Booking Action Sidebar */}
        <div className="glass-card" style={{ position: 'sticky', top: '90px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Ticket Tiers
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Choose your preferred ticket tier:
          </p>

          {/* Ticket Tiers Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {ticketTiers.map((ticket, index) => {
              const tierAvailable = (ticket.quantity || 0) - (ticket.soldQuantity || 0);
              return (
                <div 
                  key={ticket._id || index}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ color: 'var(--text-main)', fontWeight: '700', fontSize: '0.95rem' }}>{ticket.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {tierAvailable > 0 ? `${tierAvailable} remaining` : 'Sold Out'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)' }}>
                      ₹{ticket.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seat Capacity Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Ticket Availability</span>
              <span style={{ fontWeight: '700', color: totalAvailable > 0 ? 'var(--success)' : 'var(--error)' }}>
                {totalAvailable} / {totalCapacity} Seats Left
              </span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${totalCapacity > 0 ? Math.min(100, (soldTickets / totalCapacity) * 100) : 0}%`,
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button 
            onClick={handleBookClick}
            disabled={!isBookable}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '0.98rem'
            }}
          >
            {isBookable ? (user ? 'Proceed to Ticket Selection →' : 'Sign In to Book Tickets') : 'Booking Unavailable'}
          </button>

          {!isBookable && (
            <p style={{ fontSize: '0.78rem', color: 'var(--error)', textAlign: 'center', marginTop: '0.5rem' }}>
              This event is either completed, cancelled, or sold out.
            </p>
          )}
        </div>

      </div>

    </div>
  );
}

export default EventDetails;
