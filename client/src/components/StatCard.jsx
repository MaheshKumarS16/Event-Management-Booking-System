import React from 'react';

/**
 * Reusable statistic card for dashboards.
 * Props:
 *  - title: string label
 *  - value: number|string displayed prominently
 */
function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(8px)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        textAlign: 'center',
        border: '1px solid var(--border)',
        transition: 'transform 0.2s',
      }}
      className="stat-card"
    >
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>{title}</p>
      <h3 style={{ color: '#f8fafc', margin: '0.3rem 0 0', fontSize: '1.5rem' }}>{value}</h3>
    </div>
  );
}

export default StatCard;
