import React from 'react';
import RecentTable from './RecentTable';

/**
 * Table component for displaying recent bookings.
 * Safely computes total ticket counts from the ticket items array and displays currency in INR.
 */
function BookingTable({ bookings }) {
  const columns = [
    { header: 'Event', accessor: row => row.event?.title || 'Event Record' },
    { 
      header: 'Date', 
      accessor: row => row.event?.startDate || (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A')
    },
    { header: 'Venue', accessor: row => row.event?.venue || 'Venue' },
    { 
      header: 'Tickets', 
      accessor: row => {
        if (Array.isArray(row.tickets)) {
          return row.tickets.reduce((acc, t) => acc + (Number(t.quantity) || 0), 0);
        }
        return row.tickets || 1;
      }
    },
    { header: 'Amount', accessor: row => `₹${row.totalAmount || 0}` },
    {
      header: 'Status',
      accessor: row => (
        <span className={`badge ${row.bookingStatus === 'Confirmed' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.72rem' }}>
          {row.bookingStatus || 'Confirmed'}
        </span>
      )
    }
  ];

  return <RecentTable columns={columns} rows={bookings} />;
}

export default BookingTable;
