import React from 'react';

/**
 * Simple container for charts with a title and glassmorphism styling.
 */
function ChartContainer({ title, children }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        border: '1px solid var(--border)',
        transition: 'transform 0.2s',
      }}
      className="chart-container"
    >
      <h3 style={{ color: '#f8fafc', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{title}</h3>
      {children}
    </div>
  );
}

export default ChartContainer;
