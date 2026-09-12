import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../services/api';

/**
 * Global Navigation Header Component
 * 
 * Concept Explanation:
 * - What it is: A reusable navbar visible across all pages.
 * - Why we need it: Provides quick navigation links (Home, Events, Login, Register) and brand identification.
 * - Where we use it: Embedded in App.jsx layout wrapper.
 */
function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);

  // Check backend API connection for health status indicator
  useEffect(() => {
    API.get('/health')
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.85rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Eventify Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.3rem',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
          }}>
            E
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#f8fafc' }}>
              EVENT<span style={{ color: 'var(--primary)' }}>IFY</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Event Booking System</span>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: apiConnected ? 'var(--success)' : 'var(--error)'
              }}></span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link 
            to="/" 
            style={{
              fontWeight: isActive('/') ? '700' : '500',
              color: isActive('/') ? 'var(--primary)' : 'var(--text-main)',
              transition: 'color 0.2s'
            }}
          >
            Home
          </Link>
          <Link 
            to="/events" 
            style={{
              fontWeight: isActive('/events') ? '700' : '500',
              color: isActive('/events') ? 'var(--primary)' : 'var(--text-main)',
              transition: 'color 0.2s'
            }}
          >
            Explore Events
          </Link>
          
          <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border)' }}></div>

          <Link 
            to="/login"
            style={{
              padding: '0.55rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontWeight: '600',
              fontSize: '0.9rem',
              color: isActive('/login') ? 'var(--primary)' : 'var(--text-main)',
              backgroundColor: isActive('/login') ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </Link>

          <Link 
            to="/register" 
            className="btn-primary"
            style={{ padding: '0.55rem 1.3rem', fontSize: '0.9rem' }}
          >
            Register
          </Link>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            color: 'var(--text-main)',
            fontSize: '1.5rem',
            padding: '0.5rem'
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '0.5rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)}>Explore Events</Link>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
