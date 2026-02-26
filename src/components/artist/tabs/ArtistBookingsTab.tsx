import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  deposit_paid: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-red-100 text-red-700',
  rescheduled: 'bg-gray-100 text-gray-600',
};

export function ArtistBookingsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (filterStatus) params.set('status', filterStatus);
    const res = await fetch(`/api/artist/bookings?${params}`);
    const data = await res.json() as any;
    if (data.success) {
      setBookings(data.data.bookings || []);
      setTotal(data.data.pagination?.total || 0);
    }
    setLoading(false);
  }, [page, filterStatus]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (bookingId: string, status: string) => {
    await fetch('/api/artist/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId, status }),
    });
    fetchBookings();
  };

  const saveNotes = async (bookingId: string) => {
    await fetch('/api/artist/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId, artist_notes: notesValue }),
    });
    setEditingNotes(null);
    fetchBookings();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white">
          <option value="">All Statuses</option>
          {['pending','confirmed','deposit_paid','in_progress','completed','cancelled','no_show'].map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <button onClick={fetchBookings} className="px-3 py-2 rounded-lg bg-[#C8956C]/10 text-[#C8956C] text-sm font-medium hover:bg-[#C8956C]/20">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin" /></div>
        ) : bookings.length === 0 ? (
          <p className="text-center py-12 text-gray-400">No bookings found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Service</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Time</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1a1a2e]">{b.first_name} {b.last_name}</p>
                    <p className="text-xs text-gray-400">{b.client_email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.service_type}</td>
                  <td className="px-4 py-3 text-gray-600">{b.scheduled_date}</td>
                  <td className="px-4 py-3 text-gray-600">{b.scheduled_time}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {b.status === 'pending' && <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-2 py-1 rounded text-xs bg-green-50 text-green-600 hover:bg-green-100">Confirm</button>}
                      {(b.status === 'confirmed' || b.status === 'deposit_paid') && (
                        <>
                          <button onClick={() => updateStatus(b.id, 'in_progress')} className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-600 hover:bg-blue-100">Start</button>
                          <button onClick={() => updateStatus(b.id, 'no_show')} className="px-2 py-1 rounded text-xs bg-red-50 text-red-600 hover:bg-red-100">No-show</button>
                        </>
                      )}
                      {b.status === 'in_progress' && <button onClick={() => updateStatus(b.id, 'completed')} className="px-2 py-1 rounded text-xs bg-green-50 text-green-600 hover:bg-green-100">Complete</button>}
                      <button onClick={() => { setEditingNotes(editingNotes === b.id ? null : b.id); setNotesValue(b.artist_notes || ''); }} className="px-2 py-1 rounded text-xs bg-gray-50 text-gray-600 hover:bg-gray-100">Notes</button>
                    </div>
                    {editingNotes === b.id && (
                      <div className="mt-2 flex gap-2">
                        <input value={notesValue} onChange={e => setNotesValue(e.target.value)} className="flex-1 px-2 py-1 rounded border border-gray-300 text-xs" placeholder="Artist notes..." />
                        <button onClick={() => saveNotes(b.id)} className="px-2 py-1 rounded text-xs bg-[#C8956C] text-white">Save</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
