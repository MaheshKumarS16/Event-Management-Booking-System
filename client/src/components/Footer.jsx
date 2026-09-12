import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Global Footer Component
 * 
 * Concept Explanation:
 * - What it is: A persistent bottom navigation and branding footer.
 * - Why we need it: Enhances app completeness, SEO semantics, and access to quick links.
 * - Where we use it: Embedded in App.jsx layout wrapper.
 */
function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0b1120',
      borderTop: '1px solid var(--border)',
      padding: '3.5rem 0 1.5rem 0',
      marginTop: 'auto',
      color: 'var(--text-muted)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1rem',
                color: '#ffffff'
              }}>
                E
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.02em' }}>
                EVENTIFY
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              A full-stack Event Management & Booking platform supporting Customers, Organizers, and Admins with real-time ticket availability tracking.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: '700', marginBottom: '1.2rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-muted)' }}>Home Overview</Link></li>
              <li><Link to="/events" style={{ color: 'var(--text-muted)' }}>Browse Published Events</Link></li>
              <li><Link to="/login" style={{ color: 'var(--text-muted)' }}>Sign In to Account</Link></li>
              <li><Link to="/register" style={{ color: 'var(--text-muted)' }}>Create New Account</Link></li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: '700', marginBottom: '1.2rem' }}>
              Top Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li>💻 Technology & AI Summits</li>
              <li>🎵 Music Concerts & Festivals</li>
              <li>🛠️ Developer Workshops</li>
              <li>💼 Business & Startup Conclaves</li>
              <li>🎭 Stand-up Comedy & Theater</li>
            </ul>
          </div>

          {/* Demo User Roles */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: '700', marginBottom: '1.2rem' }}>
              Platform Roles
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li>👤 <strong>Customer:</strong> Event Discovery & Booking</li>
              <li>🎪 <strong>Organizer:</strong> Create & Manage Events</li>
              <li>👑 <strong>Admin:</strong> Approve Events & Platform Control</li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: 'var(--text-dim)'
        }}>
          <p>© 2026 Eventify — Built with React.js, Node.js, Express.js, and MongoDB for Software Engineer Portfolio.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
