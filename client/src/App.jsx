import React, { useState, useEffect } from 'react';
import API from './services/api';

/**
 * Eventify Root React Component (Phase 1 Setup Verification)
 * 
 * Concept Explanation:
 * - What it is: Main entry component of the React application.
 * - Why we need it: Connects UI components, tests backend API endpoints, and handles application routing.
 * - Where we use it: Rendered inside main.jsx into the DOM root element.
 */
function App() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/health');
      setHealthData(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to connect to Eventify backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header / Brand Navigation */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '1.25rem 0',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.2rem',
              color: '#fff'
            }}>
              E
            </div>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#f8fafc' }}>
                EVENTIFY
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Event Management & Booking System</p>
            </div>
          </div>

          <div className="badge badge-success">
            <span>Phase 1 — Setup Active</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container" style={{ padding: '3rem 1.5rem', flex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
          <span style={{
            color: 'var(--primary)',
            fontSize: '0.9rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Full Stack Portfolio Architecture
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 1rem 0', lineHeight: '1.2' }}>
            Discover. Book. Experience.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Phase 1 is live! React client and Express backend are communicating via REST API.
          </p>
        </div>

        {/* Backend Connectivity Status Card */}
        <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Backend Health Status</h3>
            <button 
              onClick={checkBackendHealth}
              className="btn-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              🔄 Refresh Status
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Checking backend API status...</p>
          ) : error ? (
            <div style={{ padding: '1rem', background: 'var(--error-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div className="pulse-dot offline"></div>
                <strong style={{ color: 'var(--error)' }}>Backend Connection Failed</strong>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#f8fafc' }}>{error}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Ensure your backend server is running via command: <code>npm run dev</code> inside <code>server/</code> folder.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="pulse-dot online"></div>
                <span style={{ fontWeight: '700', color: 'var(--success)' }}>
                  {healthData?.message}
                </span>
              </div>

              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                fontSize: '0.9rem',
                fontFamily: 'monospace'
              }}>
                <p><strong>Server Status:</strong> {healthData?.data?.server}</p>
                <p><strong>Database State:</strong> {healthData?.data?.database}</p>
                <p><strong>Environment:</strong> {healthData?.data?.environment}</p>
                <p><strong>Timestamp:</strong> {healthData?.data?.timestamp}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div className="glass-card">
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>⚡ Frontend Stack</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              React.js, React Router, Axios, Context API, Recharts & Modern CSS3 Design System.
            </p>
          </div>

          <div className="glass-card">
            <h4 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>🛡️ Backend Stack</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Node.js, Express.js, JWT Auth, Bcryptjs, Express Validator & Helmet Security.
            </p>
          </div>

          <div className="glass-card">
            <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>💾 Database Layer</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              MongoDB Document Store with Mongoose Schemas & ObjectId References.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 0',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        backgroundColor: '#0b1120'
      }}>
        <div className="container">
          <p>© 2026 Eventify — Event Management & Booking System. Built for Fresher Software Engineer Portfolio.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
