import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../utils/mockData';

/**
 * PAGE 4 — LOGIN PAGE (Connected to Backend Authentication API)
 * 
 * Concept Explanation:
 * - What it is: Authentication page connected to backend REST API POST /api/auth/login.
 * - Why we need it: Authenticates user credentials against MongoDB database and stores JWT session token.
 * - Where we use it: Mounted at route path '/login'.
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

  // Quick fill helper for easy testing
  const handleQuickFill = (roleKey) => {
    const creds = DEMO_CREDENTIALS[roleKey];
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
    setSuccessMsg(`Filled ${creds.role} credentials! Click Sign In.`);
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
      const redirectPath = location.state?.from?.pathname || '/events';
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.5rem',
            color: '#fff',
            marginBottom: '0.85rem'
          }}>
            E
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            Sign In to Eventify
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Access your bookings, organizer events, or admin dashboard
          </p>
        </div>

        {/* DEMO CREDENTIALS ACCORDION BOX (Prompt Requirement Rule 5) */}
        <div className="glass-card" style={{
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          padding: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            🔑 Required Demo Login Credentials
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.83rem' }}>
            
            {/* Customer Credentials */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Customer:</strong> <code>{DEMO_CREDENTIALS.customer.email}</code>
              </div>
              <button 
                type="button"
                onClick={() => handleQuickFill('customer')}
                style={{ background: 'var(--primary)', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem' }}
              >
                Auto-fill
              </button>
            </div>

            {/* Organizer Credentials */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Organizer:</strong> <code>{DEMO_CREDENTIALS.organizer.email}</code>
              </div>
              <button 
                type="button"
                onClick={() => handleQuickFill('organizer')}
                style={{ background: 'var(--secondary)', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem' }}
              >
                Auto-fill
              </button>
            </div>

            {/* Admin Credentials */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Admin:</strong> <code>{DEMO_CREDENTIALS.admin.email}</code>
              </div>
              <button 
                type="button"
                onClick={() => handleQuickFill('admin')}
                style={{ background: 'var(--accent)', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.75rem' }}
              >
                Auto-fill
              </button>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Password for all demo accounts: <code>SmartHire@123</code> (or role passwords)
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="glass-card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
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
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input 
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-dark)',
                  border: '1px solid var(--border)',
                  color: '#f8fafc',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.8rem 0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-dark)',
                    border: '1px solid var(--border)',
                    color: '#f8fafc',
                    fontSize: '0.95rem'
                  }}
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
                    fontSize: '0.85rem'
                  }}
                >
                  {showPassword ? '👁️ Hide' : '👁️ Show'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Navigation */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', fontSize: '0.88rem' }}>
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
