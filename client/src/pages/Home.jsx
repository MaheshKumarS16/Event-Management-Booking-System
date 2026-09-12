import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { MOCK_EVENTS, MOCK_CATEGORIES } from '../utils/mockData';

/**
 * PAGE 1 — HOME PAGE
 * 
 * Concept Explanation:
 * - What it is: Primary landing page of the Eventify application.
 * - Why we need it: Introduces platform value proposition, search bar, featured events, and category discovery.
 * - Where we use it: Mounted at route path '/'.
 */
function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events?search=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(cityQuery)}`);
  };

  const featuredEvents = MOCK_EVENTS.filter(e => e.featured);
  const upcomingEvents = MOCK_EVENTS.slice(0, 4);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 1) 70%)',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px', position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            🎉 Premium Event Discovery & Booking
          </span>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            lineHeight: '1.15',
            color: '#f8fafc',
            marginBottom: '1.25rem'
          }}>
            Discover. Book. <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Experience.</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            maxWidth: '700px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6'
          }}>
            Find tech summits, music festivals, coding bootcamps, and stand-up comedy shows. Book verified tickets instantly with real-time seat availability.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="glass-card" style={{
            padding: '0.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            maxWidth: '800px',
            margin: '0 auto 2rem auto',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-dark)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <span>🔍</span>
              <input 
                type="text"
                placeholder="Search event title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-dark)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <span>📍</span>
              <input 
                type="text"
                placeholder="City (e.g. Chennai)"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.8rem' }}>
              Search Events
            </button>
          </form>

          {/* Primary CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/events" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Explore Events
            </Link>
            <Link to="/register" style={{
              padding: '0.85rem 2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontWeight: '600',
              color: '#f8fafc',
              fontSize: '1rem'
            }}>
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="container" style={{ padding: '4rem 1.5rem 2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>Browse by Category</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Explore events curated for your passions</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1.25rem'
        }}>
          {MOCK_CATEGORIES.map(cat => (
            <Link 
              key={cat.id} 
              to={`/events?category=${encodeURIComponent(cat.name)}`}
              className="glass-card"
              style={{
                padding: '1.5rem 1rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
            >
              <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>{cat.name}</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{cat.count} Events</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span style={{ color: 'var(--secondary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              Handpicked Spotlight
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>Featured Events</h2>
          </div>
          <Link to="/events" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
            View All Events →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {featuredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>Upcoming Experience</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Book your tickets before they sell out</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="container" style={{ paddingTop: '3rem' }}>
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)'
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '1rem', color: '#f8fafc' }}>
            Are you an Event Organizer?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
            Publish your events, configure custom ticket tiers, manage attendees, and track real-time revenue analytics on Eventify.
          </p>
          <Link to="/register" className="btn-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
            Get Started as Organizer
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
