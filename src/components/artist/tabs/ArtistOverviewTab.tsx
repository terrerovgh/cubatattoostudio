import { useState, useEffect } from 'react';
import { CalendarDays, DollarSign, Clock, MessageCircle, TrendingUp, CheckCircle } from 'lucide-react';

export function ArtistOverviewTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/artist/stats')
      .then(r => r.json())
      .then((data: any) => { if (data.success) setStats(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin" /></div>;
  if (!stats) return <p className="text-gray-500 text-center py-10">Failed to load stats</p>;

  const statCards = [
    { label: 'Total Bookings', value: stats.total_bookings, icon: CalendarDays, color: 'text-[#1a1a2e]' },
    { label: 'Today', value: stats.bookings_today, icon: Clock, color: 'text-[#C8956C]' },
    { label: 'This Week', value: stats.bookings_this_week, icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Revenue (Month)', value: `$${(stats.revenue_month || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Pending', value: stats.pending_bookings, icon: Clock, color: 'text-yellow-600' },
    { label: 'Completed', value: stats.completed_bookings, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Unread Messages', value: stats.unread_messages, icon: MessageCircle, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {stats.upcoming_bookings?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#1a1a2e] mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {stats.upcoming_bookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-[#1a1a2e]">{b.first_name} {b.last_name}</p>
                  <p className="text-xs text-gray-500">{b.service_type} — {b.description?.slice(0, 50) || 'No description'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#1a1a2e]">{b.scheduled_date}</p>
                  <p className="text-xs text-gray-500">{b.scheduled_time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
