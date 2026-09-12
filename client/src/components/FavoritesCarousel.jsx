import React from 'react';
import EventCard from './EventCard';

/**
 * FavoritesCarousel – a glass‑morphism horizontal scroll carousel showing favorite events.
 * Props:
 *   events: Array of event objects (should contain at least _id, title, image, startDate).
 */
function FavoritesCarousel({ events }) {
  return (
    <div style={{ overflowX: 'auto', display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
      {events.map(event => (
        <div
          key={event._id}
          style={{
            minWidth: '250px',
            flex: '0 0 auto',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
          }}
          className="favorite-card"
        >
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}

export default FavoritesCarousel;
