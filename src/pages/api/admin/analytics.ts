export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse, DashboardStats } from '../../../types/booking';

function checkAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get('authorization');
  if (!auth || !env.ADMIN_PASSWORD) return false;
  return auth.replace('Bearer ', '') === env.ADMIN_PASSWORD;
}

export const GET: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  if (!checkAuth(request, env)) {
    return Response.json({ success: false, error: 'Unauthorized' } satisfies ApiResponse, { status: 401 });
  }

  try {
    const db = env.DB;
    const today = new Date().toISOString().split('T')[0];
    const monthStart = today.slice(0, 7) + '-01';

    // Total bookings
    const totalBookings = await db.prepare('SELECT COUNT(*) as c FROM bookings').first();

    // Bookings today
    const bookingsToday = await db.prepare(
      'SELECT COUNT(*) as c FROM bookings WHERE scheduled_date = ?'
    ).bind(today).first();

    // Revenue this month
    const revenueMonth = await db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM payments
      WHERE status = 'succeeded' AND created_at >= ?
    `).bind(monthStart).first();

    // Revenue today
    const revenueToday = await db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM payments
      WHERE status = 'succeeded' AND created_at >= ?
    `).bind(today).first();

    // Pending bookings
    const pendingBookings = await db.prepare(
      "SELECT COUNT(*) as c FROM bookings WHERE status IN ('pending', 'confirmed', 'deposit_paid')"
    ).first();

    // Average booking value
    const avgValue = await db.prepare(`
      SELECT COALESCE(AVG(COALESCE(final_price, estimated_price_min)), 0) as avg
      FROM bookings WHERE status = 'completed'
    `).first();

    // No-show rate
    const noShows = await db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'no_show'").first();
    const completedAndNoShow = await db.prepare(
      "SELECT COUNT(*) as c FROM bookings WHERE status IN ('completed', 'no_show')"
    ).first();
    const noShowRate = (completedAndNoShow?.c as number) > 0
      ? ((noShows?.c as number) || 0) / ((completedAndNoShow?.c as number) || 1)
      : 0;

    // Top artist
    const topArtist = await db.prepare(`
      SELECT artist_id, COUNT(*) as booking_count FROM bookings
      WHERE status NOT IN ('cancelled', 'no_show')
      GROUP BY artist_id ORDER BY booking_count DESC LIMIT 1
    `).first();

    // Top service
    const topService = await db.prepare(`
      SELECT service_type, COUNT(*) as count FROM bookings
      WHERE status NOT IN ('cancelled', 'no_show')
      GROUP BY service_type ORDER BY count DESC LIMIT 1
    `).first();

    // Revenue by artist
    const revenueByArtist = await db.prepare(`
      SELECT b.artist_id, COALESCE(SUM(p.amount), 0) as revenue, COUNT(b.id) as bookings
      FROM bookings b
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'succeeded'
      WHERE b.status NOT IN ('cancelled')
      GROUP BY b.artist_id
    `).all();

    // Bookings by status
    const bookingsByStatus = await db.prepare(`
      SELECT status, COUNT(*) as count FROM bookings GROUP BY status
    `).all();

    // Recent bookings
    const recentBookings = await db.prepare(`
      SELECT b.*, c.first_name, c.last_name, c.email
      FROM bookings b JOIN clients c ON b.client_id = c.id
      ORDER BY b.created_at DESC LIMIT 10
    `).all();

    const stats: DashboardStats = {
      total_bookings: (totalBookings?.c as number) || 0,
      bookings_today: (bookingsToday?.c as number) || 0,
      revenue_month: (revenueMonth?.total as number) || 0,
      revenue_today: (revenueToday?.total as number) || 0,
      pending_bookings: (pendingBookings?.c as number) || 0,
      avg_booking_value: (avgValue?.avg as number) || 0,
      no_show_rate: noShowRate,
      conversion_rate: 0, // Computed separately
      top_artist: (topArtist?.artist_id as string) || 'N/A',
      top_service: (topService?.service_type as string) || 'N/A',
    };

    return Response.json({
      success: true,
      data: {
        stats,
        revenue_by_artist: revenueByArtist.results,
        bookings_by_status: bookingsByStatus.results,
        recent_bookings: recentBookings.results,
      },
    } satisfies ApiResponse);
  } catch (err) {
    console.error('Analytics error:', err);
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
