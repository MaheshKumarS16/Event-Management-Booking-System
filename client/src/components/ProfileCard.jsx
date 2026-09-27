import React from 'react';

/**
 * Reusable user profile card with glassmorphism styling.
 * Props:
 *  - user: { name, email, phone, role }
 */
function ProfileCard({ user }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        marginBottom: '2rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        flexWrap: 'wrap'
      }}
      className="profile-card"
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '1.4rem',
          flexShrink: 0
        }}
      >
        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </div>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: '700' }}>
          {user.name}
        </h3>
        <p style={{ margin: '0.2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          ✉️ {user.email} {user.phone && `• 📞 ${user.phone}`}
        </p>
        <div style={{ marginTop: '0.4rem' }}>
          <span
            className={`badge ${user.role === 'admin' ? 'badge-error' : user.role === 'organizer' ? 'badge-warning' : 'badge-success'}`}
            style={{ fontSize: '0.72rem' }}
          >
            {user.role ? user.role.toUpperCase() : 'CUSTOMER'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
