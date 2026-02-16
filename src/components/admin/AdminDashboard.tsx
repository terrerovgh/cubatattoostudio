import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats, BookingWithClient } from '../../types/booking';

type Tab = 'overview' | 'bookings' | 'calendar' | 'clients' | 'inventory';

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [token, setToken] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueByArtist, setRevenueByArtist] = useState<any[]>([]);
  const [bookingsByStatus, setBookingsByStatus] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterArtist, setFilterArtist] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics', { headers: authHeaders });
      const data = await res.json() as any;
      if (data.success) {
        setStats(data.data.stats);
        setRevenueByArtist(data.data.revenue_by_artist || []);
        setBookingsByStatus(data.data.bookings_by_status || []);
        setRecentBookings(data.data.recent_bookings || []);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
    setLoading(false);
  }, [token]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterArtist) params.set('artist_id', filterArtist);
      const res = await fetch(`/api/admin/bookings?${params}`, { headers: authHeaders });
      const data = await res.json() as any;
      if (data.success) setBookings(data.data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
    setLoading(false);
  }, [token, filterStatus, filterArtist]);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      const res = await fetch(`/api/admin/clients?${params}`, { headers: authHeaders });
      const data = await res.json() as any;
      if (data.success) setClients(data.data.clients || []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
    setLoading(false);
  }, [token, searchTerm]);

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setIsAuth(true);
        const data = await res.json() as any;
        if (data.success) {
          setStats(data.data.stats);
          setRevenueByArtist(data.data.revenue_by_artist || []);
          setBookingsByStatus(data.data.bookings_by_status || []);
          setRecentBookings(data.data.recent_bookings || []);
        }
      } else {
        alert('Invalid password');
      }
    } catch {
      alert('Connection error');
    }
  };

  useEffect(() => {
    if (!isAuth) return;
    if (tab === 'overview') fetchAnalytics();
    if (tab === 'bookings') fetchBookings();
    if (tab === 'clients') fetchClients();
  }, [tab, isAuth, fetchAnalytics, fetchBookings, fetchClients]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId, status }),
    });
    fetchBookings();
  };

  // ─── Login Screen ──────────────────────────────────
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Cuba Tattoo Studio</h1>
            <p className="text-white/50 text-sm mt-1">Admin Dashboard</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Password</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C8956C]/50"
              placeholder="Enter admin password"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-[#C8956C] text-black font-semibold text-sm hover:bg-[#D4A574] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // ─── Dashboard ─────────────────────────────────────
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/50 text-sm">Cuba Tattoo Studio — Admin</p>
        </div>
        <a href="/" className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm hover:text-white transition-colors">
          ← Back to Site
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {(['overview', 'bookings', 'calendar', 'clients', 'inventory'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${
              tab === t ? 'bg-[#C8956C]/20 text-[#C8956C] border border-[#C8956C]/30' : 'bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white/70'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-white/40">
          <div className="w-5 h-5 border-2 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin mr-3" />
          Loading...
        </div>
      )}

      {/* Overview Tab */}
      {tab === 'overview' && stats && !loading && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Bookings', value: stats.total_bookings, color: '' },
              { label: 'Today', value: stats.bookings_today, color: 'text-[#C8956C]' },
              { label: 'Revenue (Month)', value: `$${stats.revenue_month.toLocaleString()}`, color: 'text-green-400' },
              { label: 'Revenue (Today)', value: `$${stats.revenue_today.toLocaleString()}`, color: 'text-green-400' },
              { label: 'Pending', value: stats.pending_bookings, color: 'text-yellow-400' },
              { label: 'Avg Value', value: `$${stats.avg_booking_value.toFixed(0)}`, color: '' },
              { label: 'No-Show Rate', value: `${(stats.no_show_rate * 100).toFixed(1)}%`, color: stats.no_show_rate > 0.1 ? 'text-red-400' : 'text-green-400' },
              { label: 'Top Artist', value: stats.top_artist, color: 'text-[#C8956C] capitalize' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color || 'text-white'}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Revenue by Artist */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <h3 className="font-bold text-white mb-4">Revenue by Artist</h3>
            <div className="space-y-3">
              {revenueByArtist.map((a: any) => (
                <div key={a.artist_id} className="flex items-center gap-4">
                  <span className="text-white capitalize w-16 text-sm font-medium">{a.artist_id}</span>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8956C] rounded-full"
                      style={{ width: `${Math.min((a.revenue / (Math.max(...revenueByArtist.map((x: any) => x.revenue)) || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-white/60 text-sm w-24 text-right">${a.revenue.toLocaleString()}</span>
                  <span className="text-white/40 text-xs w-20 text-right">{a.bookings} bookings</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <h3 className="font-bold text-white mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs">
                    <th className="text-left pb-3 font-medium">Client</th>
                    <th className="text-left pb-3 font-medium">Artist</th>
                    <th className="text-left pb-3 font-medium">Service</th>
                    <th className="text-left pb-3 font-medium">Date</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentBookings.map((b: any) => (
                    <tr key={b.id}>
                      <td className="py-3 text-white">{b.first_name} {b.last_name}</td>
                      <td className="py-3 text-white/60 capitalize">{b.artist_id}</td>
                      <td className="py-3 text-white/60">{b.service_type}</td>
                      <td className="py-3 text-white/60">{b.scheduled_date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          b.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          b.status === 'confirmed' || b.status === 'deposit_paid' ? 'bg-blue-500/20 text-blue-400' :
                          b.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-white/10 text-white/50'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === 'bookings' && !loading && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="deposit_paid">Deposit Paid</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
            <select
              value={filterArtist}
              onChange={(e) => setFilterArtist(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
            >
              <option value="">All Artists</option>
              <option value="david">David</option>
              <option value="nina">Nina</option>
              <option value="karli">Karli</option>
            </select>
            <button
              onClick={fetchBookings}
              className="px-4 py-2 rounded-xl bg-[#C8956C]/20 text-[#C8956C] text-sm font-medium hover:bg-[#C8956C]/30 transition-colors"
            >
              Refresh
            </button>
          </div>

          {/* Bookings Table */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs">
                  <th className="text-left pb-3 font-medium">Client</th>
                  <th className="text-left pb-3 font-medium">Artist</th>
                  <th className="text-left pb-3 font-medium">Service</th>
                  <th className="text-left pb-3 font-medium">Date</th>
                  <th className="text-left pb-3 font-medium">Time</th>
                  <th className="text-left pb-3 font-medium">Deposit</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b: any) => (
                  <tr key={b.id}>
                    <td className="py-3 text-white">{b.first_name} {b.last_name}</td>
                    <td className="py-3 text-white/60 capitalize">{b.artist_id}</td>
                    <td className="py-3 text-white/60">{b.service_type}</td>
                    <td className="py-3 text-white/60">{b.scheduled_date}</td>
                    <td className="py-3 text-white/60">{b.scheduled_time}</td>
                    <td className="py-3 text-white/60">{b.deposit_paid ? '✓' : '—'} ${b.deposit_amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        b.status === 'deposit_paid' ? 'bg-blue-500/20 text-blue-400' :
                        b.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-white/10 text-white/50'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'confirmed')}
                            className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          >
                            Confirm
                          </button>
                        )}
                        {(b.status === 'confirmed' || b.status === 'deposit_paid') && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'in_progress')}
                              className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'no_show')}
                              className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            >
                              No-show
                            </button>
                          </>
                        )}
                        {b.status === 'in_progress' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'completed')}
                            className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30"
                          >
                            Complete
                          </button>
                        )}
                        {!['completed', 'cancelled', 'no_show'].includes(b.status) && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'cancelled')}
                            className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <p className="text-center py-8 text-white/40">No bookings found</p>
            )}
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {tab === 'calendar' && !loading && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <h3 className="font-bold text-white mb-4">Master Calendar</h3>
          <p className="text-white/40 text-sm mb-6">
            View and manage all artist schedules. Drag and drop to reschedule appointments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['david', 'nina', 'karli'].map((artist) => (
              <div key={artist} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <h4 className="font-bold text-white capitalize mb-3">{artist}</h4>
                <div className="text-xs text-white/40">
                  <p>Tue-Fri: 11:00 AM - 7:00 PM</p>
                  <p>Sat: 11:00 AM - {artist === 'david' ? '7:00 PM' : '5:00 PM'}</p>
                  <p>Sun-Mon: Closed</p>
                </div>
                <div className="mt-3 space-y-1">
                  {bookings.filter((b: any) => b.artist_id === artist).slice(0, 5).map((b: any) => (
                    <div key={b.id} className="text-xs p-2 rounded bg-white/5 flex justify-between">
                      <span className="text-white/60">{b.scheduled_date} {b.scheduled_time}</span>
                      <span className={`${b.status === 'completed' ? 'text-green-400' : 'text-[#C8956C]'}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clients Tab */}
      {tab === 'clients' && !loading && (
        <div className="space-y-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients by name, email, or phone..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C8956C]/50"
            />
            <button
              onClick={fetchClients}
              className="px-5 py-3 rounded-xl bg-[#C8956C]/20 text-[#C8956C] text-sm font-medium hover:bg-[#C8956C]/30 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs">
                  <th className="text-left pb-3 font-medium">Name</th>
                  <th className="text-left pb-3 font-medium">Email</th>
                  <th className="text-left pb-3 font-medium">Phone</th>
                  <th className="text-left pb-3 font-medium">Visits</th>
                  <th className="text-left pb-3 font-medium">Spent</th>
                  <th className="text-left pb-3 font-medium">Tier</th>
                  <th className="text-left pb-3 font-medium">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clients.map((c: any) => (
                  <tr key={c.id}>
                    <td className="py-3 text-white">{c.first_name} {c.last_name}</td>
                    <td className="py-3 text-white/60">{c.email}</td>
                    <td className="py-3 text-white/60">{c.phone || '—'}</td>
                    <td className="py-3 text-white/60">{c.visit_count}</td>
                    <td className="py-3 text-white/60">${c.total_spent?.toFixed(0) || 0}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        c.loyalty_tier === 'vip' ? 'bg-purple-500/20 text-purple-400' :
                        c.loyalty_tier === 'gold' ? 'bg-yellow-500/20 text-yellow-400' :
                        c.loyalty_tier === 'silver' ? 'bg-gray-400/20 text-gray-300' :
                        'bg-white/10 text-white/50'
                      }`}>
                        {c.loyalty_tier}
                      </span>
                    </td>
                    <td className="py-3 text-[#C8956C]">{c.loyalty_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clients.length === 0 && (
              <p className="text-center py-8 text-white/40">No clients found</p>
            )}
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {tab === 'inventory' && !loading && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <h3 className="font-bold text-white mb-4">Inventory Management</h3>
          <p className="text-white/40 text-sm">
            Track inks, needles, supplies, and aftercare products. Low stock alerts included.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Black Ink (Dynamic)', category: 'ink', qty: 12, min: 5 },
              { name: 'Color Set (Eternal)', category: 'ink', qty: 3, min: 5 },
              { name: 'RL Needles (3RL)', category: 'needles', qty: 45, min: 20 },
              { name: 'RL Needles (5RL)', category: 'needles', qty: 32, min: 20 },
              { name: 'Grip Tape', category: 'supplies', qty: 8, min: 5 },
              { name: 'Stencil Paper', category: 'supplies', qty: 150, min: 50 },
              { name: 'Aftercare Balm', category: 'aftercare', qty: 2, min: 10 },
              { name: 'Studio T-shirts', category: 'merch', qty: 18, min: 5 },
            ].map((item) => (
              <div key={item.name} className={`p-4 rounded-xl border ${item.qty <= item.min ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.03] border-white/[0.06]'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-white">{item.name}</h4>
                    <p className="text-xs text-white/40 capitalize">{item.category}</p>
                  </div>
                  <span className={`text-lg font-bold ${item.qty <= item.min ? 'text-red-400' : 'text-white'}`}>
                    {item.qty}
                  </span>
                </div>
                {item.qty <= item.min && (
                  <p className="text-xs text-red-400 mt-2">Low stock — reorder needed</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
