import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { getPublishedEvents, getActiveCategories } from '../services/eventService';

/**
 * PAGE 1 — HOME PAGE
 * Connects to live backend API for events and categories with responsive hero and catalog.
 */
function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsData, catData] = await Promise.all([
          getPublishedEvents(),
          getActiveCategories()
        ]);
        setEvents(eventsData.events || []);
        setCategories(catData || []);
      } catch (err) {
        console.error('Home page fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events?search=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(cityQuery)}`);
  };

  const featuredEvents = events.filter(e => e.featured || e.status === 'Published').slice(0, 3);
  const upcomingEvents = events.slice(0, 4);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '4rem 1rem 3.5rem 1rem',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.25) 0%, var(--bg-main) 70%)',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px', position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.82rem',
            fontWeight: '700',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            🎉 Premium Event Discovery & Booking
          </span>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            lineHeight: '1.18',
            color: 'var(--text-main)',
            marginBottom: '1rem'
          }}>
            Discover. Book. <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Experience.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6'
          }}>
            Find tech summits, music festivals, coding bootcamps, and comedy shows. Book verified tickets instantly with real-time seat availability.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="glass-card" style={{
            padding: '0.65rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.65rem',
            maxWidth: '750px',
            margin: '0 auto 1.75rem auto',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-input)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <span>🔍</span>
              <input 
                type="text"
                placeholder="Search event or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            <div style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-input)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
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
                  color: 'var(--text-main)',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.6rem', flexShrink: 0 }}>
              Search Events
            </button>
          </form>

          {/* Primary CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link to="/events" className="btn-primary" style={{ padding: '0.75rem 1.8rem', fontSize: '0.95rem' }}>
              Explore Events
            </Link>
            <Link to="/register" style={{
              padding: '0.75rem 1.8rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontWeight: '600',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              backgroundColor: 'var(--bg-card)'
            }}>
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="container" style={{ padding: '3.5rem 1rem 2rem 1rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: '800', color: 'var(--text-main)' }}>Browse by Category</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Explore events curated for your passions</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 140px), 1fr))',
          gap: '1rem'
        }}>
          {categories.map(cat => (
            <Link 
              key={cat._id || cat.id} 
              to={`/events?category=${encodeURIComponent(cat.name)}`}
              className="glass-card"
              style={{
                padding: '1.25rem 0.85rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{cat.icon || '📅'}</span>
              <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)' }}>{cat.name}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Explore Events</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section className="container" style={{ padding: '2.5rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ color: 'var(--secondary)', fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase' }}>
              Handpicked Spotlight
            </span>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: '800', color: 'var(--text-main)' }}>Featured Events</h2>
          </div>
          <Link to="/events" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
            View All Events →
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading events catalog...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.5rem'
          }}>
            {featuredEvents.map(event => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: '800', color: 'var(--text-main)' }}>Upcoming Experience</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Book your tickets before they sell out</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading events...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.5rem'
          }}>
            {upcomingEvents.map(event => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="container" style={{ paddingTop: '2.5rem' }}>
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.22) 0%, rgba(236, 72, 153, 0.22) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)'
        }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Are you an Event Organizer?
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto 1.75rem auto' }}>
            Publish your events, configure custom ticket tiers, manage attendees, and track real-time revenue analytics on Eventify.
          </p>
          <Link to="/register" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.95rem' }}>
            Get Started as Organizer
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
