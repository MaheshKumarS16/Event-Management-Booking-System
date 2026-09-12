import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * PAGE 5 — REGISTER PAGE
 * 
 * Concept Explanation:
 * - What it is: Registration page allowing new users to create Customer or Organizer accounts.
 * - Why we need it: Captures name, email, phone, role, and password to store in the database.
 * - Where we use it: Mounted at route path '/register'.
 */
function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState('customer'); // 'customer' or 'organizer'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const { name, email, phone, password, confirmPassword } = formData;

    // Required Fields Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Phone validation
    if (phone.length < 10) {
      setError('Phone number must be at least 10 digits.');
      return;
    }

    // Password length check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    // Check for duplicate email warning (against demo customer email)
    if (email.toLowerCase() === 'mahesh.candidate@gmail.com') {
      setError('This email address is already registered as a Customer demo account.');
      return;
    }

    setSuccessMsg(`Registration successful as ${role.toUpperCase()}! Redirecting to login...`);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '520px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>
            Create an Eventify Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Join thousands of event enthusiasts and organizers
          </p>
        </div>

        {/* ROLE SELECTION TABS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-card)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.75rem',
          border: '1px solid var(--border)'
        }}>
          <button
            type="button"
            onClick={() => setRole('customer')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: role === 'customer' ? 'var(--primary)' : 'transparent',
              color: '#f8fafc',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            👤 Customer Account
          </button>
          
          <button
            type="button"
            onClick={() => setRole('organizer')}
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: role === 'organizer' ? 'var(--secondary)' : 'transparent',
              color: '#f8fafc',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            🎪 Organizer Account
          </button>
        </div>

        {/* Note on Admin restriction */}
        <div style={{
          backgroundColor: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1rem',
          fontSize: '0.78rem',
          color: 'var(--warning)',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          ⚠️ Admin registration is restricted. Admin accounts are seeded by system database setup.
        </div>

        {/* REGISTER FORM */}
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

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input 
                type="text"
                name="name"
                required
                placeholder="Mahesh Kumar"
                value={formData.name}
                onChange={handleChange}
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

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input 
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
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

            {/* Phone Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Phone Number
              </label>
              <input 
                type="tel"
                name="phone"
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
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

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Password (min 6 chars)
              </label>
              <input 
                type="password"
                name="password"
                required
                placeholder="Choose a strong password"
                value={formData.password}
                onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Confirm Password
              </label>
              <input 
                type="password"
                name="confirmPassword"
                required
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
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

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                marginTop: '0.5rem',
                background: role === 'organizer' 
                  ? 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)' 
                  : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
              }}
            >
              Register as {role === 'organizer' ? 'Organizer' : 'Customer'}
            </button>
          </form>

          {/* Footer Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Sign In
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Register;
