export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse, AvailabilityResponse, TimeSlot } from '../../../types/booking';
import { getDateModifier, getTimeModifier } from '../../../lib/pricing';
import { z } from 'zod';

const QuerySchema = z.object({
  artist_id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// Artist schedules (Should ideally be in DB, but hardcoded for now)
const SCHEDULES: Record<string, Record<string, { start: string; end: string } | null>> = {
  david: {
    monday: null,
    tuesday: { start: '11:00', end: '19:00' },
    wednesday: { start: '11:00', end: '19:00' },
    thursday: { start: '11:00', end: '19:00' },
    friday: { start: '11:00', end: '19:00' },
    saturday: { start: '11:00', end: '19:00' },
    sunday: null,
  },
  nina: {
    monday: null,
    tuesday: { start: '11:00', end: '19:00' },
    wednesday: { start: '11:00', end: '19:00' },
    thursday: { start: '11:00', end: '19:00' },
    friday: { start: '11:00', end: '19:00' },
    saturday: { start: '11:00', end: '17:00' },
    sunday: null,
  },
  karli: {
    monday: null,
    tuesday: { start: '11:00', end: '19:00' },
    wednesday: { start: '11:00', end: '19:00' },
    thursday: { start: '11:00', end: '19:00' },
    friday: { start: '11:00', end: '19:00' },
    saturday: { start: '11:00', end: '17:00' },
    sunday: null,
  },
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function generateSlots(start: string, end: string, interval: number = 60): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (cur < endMin) { // Changed to < to ensure slot fits.
    // Actually, simple start times are fine. Logic handled in availability check.
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    cur += interval;
  }
  return slots;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const parseResult = QuerySchema.safeParse({
      artist_id: url.searchParams.get('artist_id'),
      date: url.searchParams.get('date')
    });

    if (!parseResult.success) {
      return Response.json({ success: false, error: 'Invalid parameters' } satisfies ApiResponse, { status: 400 });
    }

    const { artist_id, date } = parseResult.data;
    const schedule = SCHEDULES[artist_id];

    if (!schedule) {
      return Response.json({ success: false, error: 'Unknown artist' } satisfies ApiResponse, { status: 404 });
    }

    const dateObj = new Date(date + 'T12:00:00');
    const dayName = DAY_NAMES[dateObj.getDay()];
    const daySchedule = schedule[dayName];
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

    if (!daySchedule) {
      return Response.json({
        success: true,
        data: { date, artist_id, slots: [], is_weekend: isWeekend, price_modifier: 1.0 },
      } satisfies ApiResponse<AvailabilityResponse>);
    }

    // Default Schedule
    let overrideStart = daySchedule.start;
    let overrideEnd = daySchedule.end;

    const db = locals.runtime.env.DB;
    if (db) {
      // Check schedule overrides
      const override = await db.prepare(`
        SELECT * FROM schedule_overrides WHERE artist_id = ? AND override_date = ?
      `).bind(artist_id, date).first();

      if (override) {
        if (!override.is_available) {
          return Response.json({
            success: true,
            data: { date, artist_id, slots: [], is_weekend: isWeekend, price_modifier: 1.0 },
          } satisfies ApiResponse<AvailabilityResponse>);
        }
        overrideStart = (override.start_time as string) || daySchedule.start;
        overrideEnd = (override.end_time as string) || daySchedule.end;
      }

      // Get existing bookings for this date/artist
      const existingBookings = await db.prepare(`
        SELECT scheduled_time, estimated_duration FROM bookings
        WHERE artist_id = ? AND scheduled_date = ?
        AND status NOT IN ('cancelled', 'no_show', 'rescheduled')
      `).bind(artist_id, date).all();

      // Convert bookings to blocked intervals
      const blockedIntervals: { start: number; end: number }[] = (existingBookings.results || []).map((b: any) => {
        const start = timeToMinutes(b.scheduled_time as string);
        const duration = (b.estimated_duration as number) || 60;
        return { start, end: start + duration };
      });

      const times = generateSlots(overrideStart, overrideEnd);
      const dateMod = getDateModifier(date);

      const slots: TimeSlot[] = times.map((time) => {
        const timeVal = timeToMinutes(time);

        // Check if this slot START time falls inside any blocked interval
        // Note: This logic assumes if the start time is free, it's listed.
        // It does NOT strictly guarantee that a 5-hour tattoo fits.
        // But preventing START time overlap is a massive improvement over exact match.
        const isBlocked = blockedIntervals.some(interval =>
          timeVal >= interval.start && timeVal < interval.end
        );

        const timeMod = getTimeModifier(time);
        return {
          time,
          available: !isBlocked,
          price_modifier: dateMod.modifier * timeMod.modifier,
        };
      });

      return Response.json({
        success: true,
        data: { date, artist_id, slots, is_weekend: isWeekend, price_modifier: dateMod.modifier },
      } satisfies ApiResponse<AvailabilityResponse>);
    }

    // Fallback without DB
    const times = generateSlots(daySchedule.start, daySchedule.end);
    const dateMod = getDateModifier(date);

    const slots: TimeSlot[] = times.map((time) => {
      const timeMod = getTimeModifier(time);
      return {
        time,
        available: true,
        price_modifier: dateMod.modifier * timeMod.modifier,
      };
    });

    return Response.json({
      success: true,
      data: { date, artist_id, slots, is_weekend: isWeekend, price_modifier: dateMod.modifier },
    } satisfies ApiResponse<AvailabilityResponse>);
  } catch (err) {
    console.error('Availability error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' } satisfies ApiResponse,
      { status: 500 },
    );
  }
};
