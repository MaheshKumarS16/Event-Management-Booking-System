import React from 'react';

/**
 * Generic table component for dashboards.
 * Responsive with horizontal scroll support and theme tokens.
 */
function RecentTable({ columns, rows }) {
  return (
    <div className="table-responsive" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '550px' }}>
        <thead style={{ background: 'var(--bg-card)' }}>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border)', fontSize: '0.82rem', textTransform: 'uppercase', fontWeight: '700' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows && rows.length > 0 ? (
            rows.map((row, rIdx) => (
              <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={{ padding: '0.75rem 1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', fontSize: '0.88rem' }}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentTable;
