import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../utils/mockData';

/**
 * PAGE 4 — LOGIN PAGE
 * Connected to backend REST API POST /api/auth/login.
 * Authenticates user credentials, retrieves JWT token, and redirects role-appropriately.
 */
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick fill helper for easy testing & demo presentation
  const handleQuickFill = (roleKey) => {
    const creds = DEMO_CREDENTIALS[roleKey];
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
    setSuccessMsg(`Loaded ${creds.role} credentials! Click Sign In.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(`Authenticated as ${result.user.name} (${result.user.role.toUpperCase()})! Redirecting...`);
      
      // Determine smart role-based destination or preserve attempted protected route
      let defaultPath = '/events';
      if (result.user.role === 'admin') defaultPath = '/admin/dashboard';
      else if (result.user.role === 'organizer') defaultPath = '/organizer/dashboard';

      const redirectPath = location.state?.from?.pathname || defaultPath;
      setTimeout(() => {
        navigate(redirectPath);
      }, 700);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem 5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '460px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.4rem',
            color: '#fff',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
          }}>
            E
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Sign In to Eventify
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Access ticket bookings, organizer events, or system admin controls
          </p>
        </div>

        {/* DEMO CREDENTIALS QUICK FILL CARD */}
        <div className="glass-card" style={{
          backgroundColor: 'var(--primary-light)',
          borderColor: 'rgba(99, 102, 241, 0.35)',
          padding: '1.15rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            🔑 Demo Quick-Login Accounts
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
            
            {/* Customer Credentials */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>Customer:</strong> <code style={{ color: 'var(--text-muted)' }}>{DEMO_CREDENTIALS.customer.email}</code>
              </div>
              <button 
                type="button"
                onClick={() => handleQuickFill('customer')}
                style={{ background: 'var(--primary)', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', flexShrink: 0 }}
              >
                Auto-fill
              </button>
            </div>

            {/* Organizer Credentials */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>Organizer:</strong> <code style={{ color: 'var(--text-muted)' }}>{DEMO_CREDENTIALS.organizer.email}</code>
              </div>
              <button 
                type="button"
                onClick={() => handleQuickFill('organizer')}
                style={{ background: 'var(--secondary)', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', flexShrink: 0 }}
              >
                Auto-fill
              </button>
            </div>

            {/* Admin Credentials */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>Admin:</strong> <code style={{ color: 'var(--text-muted)' }}>{DEMO_CREDENTIALS.admin.email}</code>
              </div>
              <button 
                type="button"
                onClick={() => handleQuickFill('admin')}
                style={{ background: 'var(--accent)', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700', flexShrink: 0 }}
              >
                Auto-fill
              </button>
            </div>
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="glass-card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--error)', fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--success-bg)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.85rem' }}>
                ✅ {successMsg}
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  style={{ paddingRight: '4rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.98rem', marginTop: '0.25rem' }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Navigation */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Register Here
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Login;
