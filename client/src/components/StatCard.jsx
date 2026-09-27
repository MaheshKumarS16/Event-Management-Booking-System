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
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1rem',
        textAlign: 'center',
        border: '1px solid var(--border)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      className="stat-card"
    >
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem', fontWeight: '600' }}>{title}</p>
      <h3 style={{ color: 'var(--text-main)', margin: '0.35rem 0 0', fontSize: '1.5rem', fontWeight: '800' }}>{value}</h3>
    </div>
  );
}

export default StatCard;
