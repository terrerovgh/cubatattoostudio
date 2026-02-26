export const prerender = false;

import type { APIRoute } from 'astro';
import type { SessionData } from '../../../types/auth';

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime.env;
  const session = context.locals.session as SessionData;
  const artistId = session.artist_id;

  try {
    const db = env.DB;
    const today = new Date().toISOString().split('T')[0];
    const monthStart = today.slice(0, 7) + '-01';

    // Calculate start of current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const [
      totalBookings,
      bookingsToday,
      bookingsThisWeek,
      revenueMonth,
      pendingBookings,
      completedBookings,
      unreadMessages,
      upcomingBookings,
    ] = await Promise.all([
      // Total bookings for this artist
      db
        .prepare('SELECT COUNT(*) as c FROM bookings WHERE artist_id = ?')
        .bind(artistId)
        .first<{ c: number }>(),

      // Bookings today
      db
        .prepare('SELECT COUNT(*) as c FROM bookings WHERE artist_id = ? AND scheduled_date = ?')
        .bind(artistId, today)
        .first<{ c: number }>(),

      // Bookings this week
      db
        .prepare(
          `SELECT COUNT(*) as c FROM bookings
           WHERE artist_id = ? AND scheduled_date >= ? AND scheduled_date <= ?`,
        )
        .bind(artistId, weekStartStr, today)
        .first<{ c: number }>(),

      // Revenue this month (SUM of final_price WHERE status='completed')
      db
        .prepare(
          `SELECT COALESCE(SUM(final_price), 0) as total FROM bookings
           WHERE artist_id = ? AND status = 'completed'
             AND scheduled_date >= ?`,
        )
        .bind(artistId, monthStart)
        .first<{ total: number }>(),

      // Pending bookings count
      db
        .prepare(
          `SELECT COUNT(*) as c FROM bookings
           WHERE artist_id = ? AND status IN ('pending', 'confirmed', 'deposit_paid')`,
        )
        .bind(artistId)
        .first<{ c: number }>(),

      // Completed bookings count
      db
        .prepare(
          "SELECT COUNT(*) as c FROM bookings WHERE artist_id = ? AND status = 'completed'",
        )
        .bind(artistId)
        .first<{ c: number }>(),

      // Unread messages count (client messages in this artist's rooms)
      db
        .prepare(
          `SELECT COUNT(*) as c FROM chat_messages cm
           JOIN chat_rooms cr ON cm.room_id = cr.id
           WHERE cr.artist_id = ? AND cm.sender_type = 'client' AND cm.is_read = 0`,
        )
        .bind(artistId)
        .first<{ c: number }>(),

      // Upcoming bookings (next 5)
      db
        .prepare(
          `SELECT b.id, b.scheduled_date, b.scheduled_time, b.estimated_duration,
                  b.status, b.service_type, b.description,
                  c.first_name, c.last_name, c.email as client_email
           FROM bookings b
           JOIN clients c ON b.client_id = c.id
           WHERE b.artist_id = ? AND b.scheduled_date >= ?
             AND b.status NOT IN ('cancelled', 'no_show', 'completed')
           ORDER BY b.scheduled_date ASC, b.scheduled_time ASC
           LIMIT 5`,
        )
        .bind(artistId, today)
        .all(),
    ]);

    return Response.json({
      success: true,
      data: {
        total_bookings: totalBookings?.c || 0,
        bookings_today: bookingsToday?.c || 0,
        bookings_this_week: bookingsThisWeek?.c || 0,
        revenue_month: revenueMonth?.total || 0,
        pending_bookings: pendingBookings?.c || 0,
        completed_bookings: completedBookings?.c || 0,
        unread_messages: unreadMessages?.c || 0,
        upcoming_bookings: upcomingBookings.results,
      },
    });
  } catch (err) {
    console.error('Artist stats GET error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
