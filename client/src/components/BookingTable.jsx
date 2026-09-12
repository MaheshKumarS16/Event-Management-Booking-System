import React from 'react';
import RecentTable from './RecentTable';

/**
 * Table component for displaying recent bookings.
 * Expects `bookings` array where each item contains:
 *   - event: { title, startDate, venue }
 *   - createdAt, tickets (number), totalAmount
 */
function BookingTable({ bookings }) {
  const columns = [
    { header: 'Event', accessor: row => row.event?.title || 'N/A' },
    { header: 'Date', accessor: row => new Date(row.event?.startDate).toLocaleDateString() },
    { header: 'Venue', accessor: row => row.event?.venue || 'N/A' },
    { header: 'Tickets', accessor: row => row.tickets || 0 },
    { header: 'Amount', accessor: row => `$${(row.totalAmount || 0).toFixed(2)}` }
  ];

  return <RecentTable columns={columns} rows={bookings} />;
}

export default BookingTable;
