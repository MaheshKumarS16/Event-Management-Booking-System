import React, { useEffect, useState } from 'react';
import API from '../services/api';
import StatCard from '../components/StatCard';
import ChartContainer from '../components/ChartContainer';
import RecentTable from '../components/RecentTable';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

/**
 * Organizer Dashboard (Organizer role)
 *
 * Shows analytics for the logged‑in organizer: total events, published events, pending events,
 * total bookings, total attendees, total revenue. Also displays a bookings‑over‑time line chart
 * and a ticket‑type distribution pie chart. Recent attendee list is shown in a table.
 */
function OrganizerDashboard() {
  const [stats, setStats] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, attendeesRes] = await Promise.all([
          API.get('/organizer/dashboard'),
          API.get('/organizer/attendees')
        ]);
        setStats(statsRes.data.data);
        setAttendees(attendeesRes.data.data);
      } catch (err) {
        console.error('Organizer dashboard load error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock chart data if real time data is not available yet
  const lineData = stats?.bookingsOverTime || [
    { date: '2023-01', bookings: 12 },
    { date: '2023-02', bookings: 18 },
    { date: '2023-03', bookings: 9 },
    { date: '2023-04', bookings: 22 },
    { date: '2023-05', bookings: 15 }
  ];

  const pieData = stats?.ticketDistribution || [
    { name: 'VIP', value: 40 },
    { name: 'Regular', value: 120 },
    { name: 'Student', value: 60 }
  ];
  const COLORS = ['#6366f1', '#ec4899', '#34d399'];

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>;
  if (!stats) return <p style={{ color: 'var(--error)' }}>Failed to load statistics.</p>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ color: '#f8fafc', marginBottom: '1.5rem' }}>Organizer Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard title="Total Events" value={stats.totalEvents} />
        <StatCard title="Published" value={stats.publishedEvents} />
        <StatCard title="Pending" value={stats.pendingEvents} />
        <StatCard title="Bookings" value={stats.totalBookings} />
        <StatCard title="Attendees" value={stats.totalAttendees} />
        <StatCard title="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <ChartContainer title="Bookings Over Time">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="var(--primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Ticket Type Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <h2 style={{ color: '#f8fafc', marginBottom: '0.75rem' }}>Recent Attendees</h2>
      <RecentTable
        columns={[
          { header: 'Name', accessor: row => row.user?.name || 'N/A' },
          { header: 'Email', accessor: row => row.user?.email || 'N/A' },
          { header: 'Event', accessor: row => row.event?.title || 'N/A' },
          { header: 'Date', accessor: row => new Date(row.createdAt).toLocaleDateString() }
        ]}
        rows={attendees}
      />
    </div>
  );
}

export default OrganizerDashboard;
