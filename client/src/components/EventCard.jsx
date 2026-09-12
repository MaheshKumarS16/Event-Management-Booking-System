import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Event Card Component
 * 
 * Concept Explanation:
 * - What it is: A modular card component that formats individual event information.
 * - Why we need it: Promotes DRY (Don't Repeat Yourself) code across Home and Events pages.
 * - Where we use it: Rendered in lists on Home.jsx and Events.jsx.
 */
function EventCard({ event }) {
  const availableTickets = event.totalCapacity - event.soldTickets;
  const isSoldOut = availableTickets <= 0;

  return (
    <div className="glass-card" style={{
      padding: '0',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      height: '100%',
      position: 'relative'
    }}>
      {/* Event Banner Image with Overlay Badge */}
      <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
        <img 
          src={event.image} 
          alt={event.title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            // Fallback image if remote URL fails to load
            e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Category Badge */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          color: '#f8fafc',
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '0.3rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-light)'
        }}>
          {event.category}
        </span>

        {/* Featured Tag if applicable */}
        {event.featured && (
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: '800',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 2px 8px rgba(236, 72, 153, 0.4)'
          }}>
            FEATURED
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '700',
          color: '#f8fafc',
          lineHeight: '1.35',
          marginBottom: '0.65rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.title}
        </h3>

        {/* Date & Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          <span>📅</span>
          <span>{event.startDate} • {event.startTime}</span>
        </div>

        {/* Location / Venue */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <span>📍</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {event.venue}, {event.city}
          </span>
        </div>

        {/* Card Footer: Price & Ticket Availability */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Starts from</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
              ₹{event.startingPrice}
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${isSoldOut ? 'badge-error' : 'badge-success'}`} style={{ fontSize: '0.75rem' }}>
              {isSoldOut ? 'Sold Out' : `${availableTickets} left`}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/events/${event.id}`}
          className="btn-primary"
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.6rem',
            fontSize: '0.88rem',
            textAlign: 'center'
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
