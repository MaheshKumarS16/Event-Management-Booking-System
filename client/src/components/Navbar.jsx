import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

/**
 * Global Navigation Header Component (Connected to Auth Context & Bookings)
 * 
 * Concept Explanation:
 * - What it is: Reusable navbar reflecting live user authentication state and booking links.
 * - Why we need it: Provides navigation and user status (Customer, Organizer, Admin badge & Logout button).
 * - Where we use it: Rendered in App.jsx.
 */
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);

  // Check backend API connection for health status indicator
  useEffect(() => {
    API.get('/health')
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

          {user && (
            <Link 
              to="/my-bookings" 
              style={{
                fontWeight: isActive('/my-bookings') ? '700' : '500',
                color: isActive('/my-bookings') ? 'var(--primary)' : 'var(--text-main)',
                transition: 'color 0.2s'
              }}
            >
              My Bookings
            </Link>
          )}
          
          <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border)' }}></div>

          {/* User Profile Badge or Login/Register Actions */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#f8fafc' }}>
                    {user.name}
                  </span>
                  <span className={`badge ${user.role === 'admin' ? 'badge-error' : user.role === 'organizer' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--error-bg)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: 'var(--error)',
                  fontSize: '0.82rem',
                  fontWeight: '600'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login"
                style={{
                  padding: '0.55rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: isActive('/login') ? 'var(--primary)' : 'var(--text-main)',
                  backgroundColor: isActive('/login') ? 'var(--primary-light)' : 'transparent'
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
            </>
          )}
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
          {user && <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>}
          {user ? (
            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ color: 'var(--error)', textAlign: 'left' }}>
              Sign Out ({user.name})
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
