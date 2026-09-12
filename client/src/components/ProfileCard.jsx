import React from 'react';

/**
 * Reusable user profile card with glassmorphism styling.
 * Props:
 *  - user: { name, email, role }
 */
function ProfileCard({ user }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        transition: 'transform 0.2s',
      }}
      className="profile-card"
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '1.2rem',
        }}
      >
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <h3 style={{ margin: 0, color: '#f8fafc' }}>{user.name}</h3>
        <p style={{ margin: '0.25rem 0', color: 'var(--text-muted)' }}>{user.email}</p>
        <span
          className={`badge ${user.role === 'admin' ? 'badge-error' : user.role === 'organizer' ? 'badge-warning' : 'badge-success'}`}
          style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}
        >
          {user.role.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default ProfileCard;
