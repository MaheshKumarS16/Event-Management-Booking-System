import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { getPublishedEvents, getActiveCategories } from '../services/eventService';
import useDebounce from '../hooks/useDebounce';

/**
 * PAGE 2 — EVENTS EXPLORER PAGE
 * Search, filter, and sort published events dynamically with responsive controls.
 */
function Events() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialCity = searchParams.get('city') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('date');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [ticketType, setTicketType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueTicketTypes, setUniqueTicketTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catData = await getActiveCategories();
        setCategories(catData || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const params = {
        search: debouncedSearchTerm,
        category: selectedCategory,
        city: selectedCity,
        maxPrice,
        sortBy,
        page: currentPage,
        limit: 6,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        ticketType: ticketType !== 'All' ? ticketType : undefined
      };

      try {
        const result = await getPublishedEvents(params);
        setEvents(result.events || []);
        setTotalPages(result.totalPages || 1);

        const types = new Set();
        (result.events || []).forEach(ev => {
          if (Array.isArray(ev.ticketTypes)) {
            ev.ticketTypes.forEach(tt => types.add(tt.name));
          }
        });
        setUniqueTicketTypes(Array.from(types));
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedSearchTerm, selectedCategory, selectedCity, maxPrice, sortBy, currentPage, dateFrom, dateTo, ticketType]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setMaxPrice(3000);
    setSortBy('date');
    setDateFrom('');
    setDateTo('');
    setTicketType('All');
    setCurrentPage(1);
    setSearchParams({});
  };

  const cities = ['All', 'Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'New Delhi'];

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 5rem 1rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.3rem)', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Explore Published Events
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Discover upcoming conferences, music concerts, comedy shows, and sports events.
        </p>
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(prev => !prev)}
        style={{
          marginBottom: '1rem',
          padding: '0.45rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          fontWeight: '700',
          fontSize: '0.88rem',
          cursor: 'pointer'
        }}
      >
        {showFilters ? '▲ Hide Filter Panel' : '▼ Show Filter & Search Panel'}
      </button>

      {/* FILTER & SEARCH PANEL */}
      {showFilters && (
        <div className="glass-card" style={{ marginBottom: '2.25rem', padding: '1.5rem 1.25rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '1.1rem',
            alignItems: 'end'
          }}>
            
            {/* Keyword Search */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Search Event
              </label>
              <input 
                type="text"
                placeholder="Title or keywords..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="form-control"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="form-control"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c._id || c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Location / City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
                className="form-control"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                <span>Max Ticket Price</span>
                <span style={{ color: 'var(--primary)' }}>₹{maxPrice}</span>
              </div>
              <input 
                type="range"
                min="200"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer', height: '36px' }}
              />
            </div>

            {/* Ticket Type Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Ticket Tier
              </label>
              <select
                value={ticketType}
                onChange={(e) => { setTicketType(e.target.value); setCurrentPage(1); }}
                className="form-control"
              >
                <option value="All">All Tiers</option>
                {uniqueTicketTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Sort Option */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control"
              >
                <option value="date">Date: Earliest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>

          </div>

          {/* Reset Filter Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
            <button 
              onClick={handleResetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* RESULTS COUNT BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Showing <strong>{events.length}</strong> published event{events.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* EVENTS GRID */}
      {loading ? (
        <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading events...
        </div>
      ) : events.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '1.75rem'
        }}>
          {events.map(event => (
            <EventCard key={event._id || event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            No Events Match Your Filters
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Try adjusting your search query, location, or price filters to discover more events.
          </p>
          <button onClick={handleResetFilters} className="btn-primary">
            Clear All Filters
          </button>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: currentPage === 1 ? 'var(--text-dim)' : 'var(--text-main)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--bg-card)',
                color: currentPage === page ? '#ffffff' : 'var(--text-main)',
                fontWeight: currentPage === page ? '700' : '500'
              }}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: currentPage === totalPages ? 'var(--text-dim)' : 'var(--text-main)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}

export default Events;
