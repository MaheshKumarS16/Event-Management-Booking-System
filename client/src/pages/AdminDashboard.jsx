import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import StatCard from '../components/StatCard';

/**
 * Admin Dashboard Component
 * 
 * Features:
 * - Real platform analytics (Users, Organizers, Revenue, Events, Bookings)
 * - User Management (Search, role filter, block / unblock account)
 * - Event Moderation (Status filter, approve, publish, reject, cancel)
 */
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'events'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', message: '' });

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [eventStatusFilter, setEventStatusFilter] = useState('All');

  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get('/admin/dashboard');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const params = {};
      if (userRoleFilter !== 'All') params.role = userRoleFilter;
      if (userSearch.trim()) params.search = userSearch.trim();
      const res = await API.get('/admin/users', { params });
      if (res.data?.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, [userRoleFilter, userSearch]);

  const fetchEvents = useCallback(async () => {
    try {
      const params = { limit: 50 };
      if (eventStatusFilter !== 'All') params.status = eventStatusFilter;
      const res = await API.get('/events', { params });
      if (res.data?.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  }, [eventStatusFilter]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchUsers(), fetchEvents()]);
    setLoading(false);
  }, [fetchStats, fetchUsers, fetchEvents]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle User Block / Unblock
  const handleToggleUserStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'blocked' : 'active';
    const confirmMsg = `Are you sure you want to ${nextStatus === 'blocked' ? 'SUSPEND' : 'RESTORE'} account access for "${user.name}"?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await API.put(`/admin/users/${user._id}/status`, { status: nextStatus });
      if (res.data?.success) {
        setNotice({
          type: 'success',
          message: `User "${user.name}" has been ${nextStatus === 'blocked' ? 'suspended' : 'unblocked'}.`
        });
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Failed to update user status.' });
    }
  };

  // Handle Event Status Change (Approve, Reject, Cancel)
  const handleUpdateEventStatus = async (eventId, eventTitle, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status of "${eventTitle}" to "${newStatus}"?`)) return;

    try {
      const res = await API.put(`/events/${eventId}/status`, { status: newStatus });
      if (res.data?.success) {
        setNotice({
          type: 'success',
          message: `Event "${eventTitle}" status updated to ${newStatus}.`
        });
        fetchEvents();
        fetchStats();
      }
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Failed to update event status.' });
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 5rem 1rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-error">Admin Portal</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>System Administrator Access</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.3rem)', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Platform Administration
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Monitor real-time booking revenue, manage user permissions, and moderate event listings.
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="btn-primary"
          style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
        >
          🔄 Refresh Analytics
        </button>
      </div>

      {/* Action Notification */}
      {notice.message && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          backgroundColor: notice.type === 'error' ? 'var(--error-bg)' : 'var(--success-bg)',
          border: `1px solid ${notice.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
          color: notice.type === 'error' ? 'var(--error)' : 'var(--success)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{notice.type === 'error' ? '⚠️' : '✅'} {notice.message}</span>
          <button 
            onClick={() => setNotice({ type: '', message: '' })} 
            style={{ background: 'none', color: 'inherit', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '2rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        {[
          { id: 'overview', label: '📊 System Metrics', count: null },
          { id: 'users', label: '👥 User Accounts', count: users.length },
          { id: 'events', label: '🎪 Event Moderation', count: events.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeTab === tab.id ? 'var(--primary)' : 'var(--border)',
              backgroundColor: activeTab === tab.id ? 'var(--primary-light)' : 'var(--bg-card)',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: activeTab === tab.id ? '700' : '600',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span style={{
                fontSize: '0.75rem',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--border)',
                color: '#fff'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading admin data...
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW & STATS */}
          {activeTab === 'overview' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <StatCard title="Total Customers" value={stats?.totalUsers || 0} />
                <StatCard title="Organizers" value={stats?.totalOrganizers || 0} />
                <StatCard title="Total Events" value={stats?.totalEvents || 0} />
                <StatCard title="Published Events" value={stats?.publishedEvents || 0} />
                <StatCard title="Pending Approval" value={stats?.pendingEvents || 0} />
                <StatCard title="Confirmed Bookings" value={stats?.totalBookings || 0} />
                <StatCard title="Total Platform Revenue" value={`₹${stats?.totalRevenue || 0}`} />
              </div>

              {/* Quick Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem' }}>
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>
                    🛡️ Security & Roles Breakdown
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Customer Accounts</span>
                      <strong style={{ color: 'var(--text-main)' }}>{stats?.totalUsers || 0}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Event Organizers</span>
                      <strong style={{ color: 'var(--text-main)' }}>{stats?.totalOrganizers || 0}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Event Approval Rate</span>
                      <strong style={{ color: 'var(--success)' }}>
                        {stats?.totalEvents > 0 ? `${Math.round(((stats.publishedEvents || 0) / stats.totalEvents) * 100)}%` : '100%'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>
                    ⚡ Platform Quick Actions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                      onClick={() => setActiveTab('events')}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-main)',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.88rem'
                      }}
                    >
                      🎪 Review & Moderate Events →
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-main)',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: '0.88rem'
                      }}
                    >
                      👥 Manage Registered Accounts →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    Registered Users Management
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    View account profiles, roles, and toggle access permissions.
                  </p>
                </div>

                {/* Filter Controls */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search by name, email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="form-control"
                    style={{ width: '220px', padding: '0.45rem 0.85rem' }}
                  />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="form-control"
                    style={{ width: '140px', padding: '0.45rem 0.85rem' }}
                  >
                    <option value="All">All Roles</option>
                    <option value="customer">Customer</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Email Address</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{u.name}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {u._id.slice(-6)}</span>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{u.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'badge-error' : u.role === 'organizer' ? 'badge-warning' : 'badge-success'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.status === 'blocked' ? 'badge-error' : 'badge-success'}`}>
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {u.role !== 'admin' ? (
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              style={{
                                padding: '0.4rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: u.status === 'blocked' ? 'var(--success-bg)' : 'var(--error-bg)',
                                border: `1px solid ${u.status === 'blocked' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                                color: u.status === 'blocked' ? 'var(--success)' : 'var(--error)',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              {u.status === 'blocked' ? 'Unblock' : 'Block User'}
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EVENT MODERATION */}
          {activeTab === 'events' && (
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    Event Moderation & Catalog Control
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Review submitted events, approve drafts, or cancel discontinued events.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <select
                    value={eventStatusFilter}
                    onChange={(e) => setEventStatusFilter(e.target.value)}
                    className="form-control"
                    style={{ width: '180px', padding: '0.45rem 0.85rem' }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Draft">Draft</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Event Details</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Schedule</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(ev => {
                      const catName = typeof ev.category === 'object' ? ev.category?.name : ev.category;
                      return (
                        <tr key={ev._id}>
                          <td>
                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{ev.title}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                              Seats: {ev.availableTickets || 'N/A'} available / {ev.totalCapacity || 'N/A'}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{catName || 'General'}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{ev.venue}, {ev.city}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{ev.startDate}</td>
                          <td>
                            <span className={`badge ${
                              ev.status === 'Published' ? 'badge-success' :
                              ev.status === 'Pending Approval' ? 'badge-warning' :
                              ev.status === 'Cancelled' ? 'badge-error' : 'badge-warning'
                            }`}>
                              {ev.status || 'Published'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                              {ev.status !== 'Published' && (
                                <button
                                  onClick={() => handleUpdateEventStatus(ev._id, ev.title, 'Published')}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--success-bg)',
                                    border: '1px solid rgba(16,185,129,0.3)',
                                    color: 'var(--success)',
                                    fontSize: '0.78rem',
                                    fontWeight: '700'
                                  }}
                                >
                                  Publish
                                </button>
                              )}
                              {ev.status === 'Published' && (
                                <button
                                  onClick={() => handleUpdateEventStatus(ev._id, ev.title, 'Cancelled')}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--error-bg)',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    color: 'var(--error)',
                                    fontSize: '0.78rem',
                                    fontWeight: '700'
                                  }}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default AdminDashboard;
