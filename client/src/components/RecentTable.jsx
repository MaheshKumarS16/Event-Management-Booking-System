import React from 'react';

/**
 * Generic table component for dashboards.
 * Props:
 *  - columns: [{ header: string, accessor: (row) => any }]
 *  - rows: array of data objects
 */
function RecentTable({ columns, rows }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ padding: '0.75rem', color: '#f8fafc', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
              {columns.map((col, cIdx) => (
                <td key={cIdx} style={{ padding: '0.5rem 0.75rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border)' }}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentTable;
