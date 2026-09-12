import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { MOCK_EVENTS, MOCK_CATEGORIES } from '../utils/mockData';

/**
 * PAGE 2 — EVENTS EXPLORER PAGE
 * 
 * Concept Explanation:
 * - What it is: Search and filter view listing all published events.
 * - Why we need it: Enables users to search, filter by city/category/price, and sort events dynamically.
 * - Where we use it: Mounted at route path '/events'.
 */
function Events() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial query params from URL
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialCity = searchParams.get('city') || 'All';

  // State Filters
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Extract unique cities from mock dataset
  const cities = ['All', ...new Set(MOCK_EVENTS.map(e => e.city))];

  // Filtering & Sorting Logic
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => {
      // Search term matching (Title or Description)
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category matching
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;

      // City matching
      const matchesCity = selectedCity === 'All' || event.city.toLowerCase() === selectedCity.toLowerCase();

      // Price filter
      const matchesPrice = event.startingPrice <= maxPrice;

      return matchesSearch && matchesCategory && matchesCity && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
      if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
      if (sortBy === 'popularity') return b.soldTickets - a.soldTickets;
      // Default: sort by date
      return new Date(a.startDate) - new Date(b.startDate);
    });
  }, [searchTerm, selectedCategory, selectedCity, maxPrice, sortBy]);

  // Pagination Math
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setMaxPrice(3000);
    setSortBy('date');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f8fafc' }}>
          Explore Published Events
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Discover upcoming conferences, music concerts, comedy shows, and sports events.
        </p>
      </div>

      {/* FILTER & SEARCH PANEL */}
      <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          alignItems: 'end'
        }}>
          
          {/* Keyword Search */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Search Event
            </label>
            <input 
              type="text"
              placeholder="Title or description..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-dark)',
                border: '1px solid var(--border)',
                color: '#f8fafc',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-dark)',
                border: '1px solid var(--border)',
                color: '#f8fafc',
                fontSize: '0.9rem'
              }}
            >
              <option value="All">All Categories</option>
              {MOCK_CATEGORIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Location / City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-dark)',
                border: '1px solid var(--border)',
                color: '#f8fafc',
                fontSize: '0.9rem'
              }}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <span>Max Price</span>
              <span style={{ color: 'var(--primary)' }}>₹{maxPrice}</span>
            </div>
            <input 
              type="range"
              min="200"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>

          {/* Sort Option */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-dark)',
                border: '1px solid var(--border)',
                color: '#f8fafc',
                fontSize: '0.9rem'
              }}
            >
              <option value="date">Date (Earliest First)</option>
              <option value="popularity">Popularity (Most Booked)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Reset Filter Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button 
            onClick={handleResetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* RESULTS BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Showing <strong>{paginatedEvents.length}</strong> of <strong>{filteredEvents.length}</strong> published events
        </p>
      </div>

      {/* EVENTS GRID */}
      {paginatedEvents.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {paginatedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#f8fafc' }}>
            No Events Match Your Filters
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Try adjusting your search terms, location, or price filters.
          </p>
          <button onClick={handleResetFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: currentPage === 1 ? 'var(--text-dim)' : '#f8fafc',
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
                color: '#f8fafc',
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
              color: currentPage === totalPages ? 'var(--text-dim)' : '#f8fafc',
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
