export const prerender = false;

import type { APIRoute } from 'astro';
import type { ApiResponse, ConsentForm } from '../../../types/booking';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = locals.runtime.env;
    const db = env.DB;
    const body = await request.json();

    const {
      booking_id,
      full_name,
      date_of_birth,
      government_id_type,
      emergency_contact_name,
      emergency_contact_phone,
      has_allergies,
      allergies_detail,
      has_medical_conditions,
      medical_conditions_detail,
      is_pregnant,
      is_on_blood_thinners,
      has_skin_conditions,
      skin_conditions_detail,
      recent_alcohol,
      ack_age_18,
      ack_sober,
      ack_aftercare,
      ack_infection_risk,
      ack_no_guarantee,
      ack_photo_release,
      ack_final_design,
      signature_data,
    } = body;

    if (!booking_id || !full_name || !date_of_birth || !signature_data) {
      return Response.json(
        { success: false, error: 'Missing required consent fields' } satisfies ApiResponse,
        { status: 400 },
      );
    }

    // Verify all acknowledgements
    const requiredAcks = [ack_age_18, ack_sober, ack_aftercare, ack_infection_risk, ack_no_guarantee, ack_final_design];
    if (requiredAcks.some((a) => !a)) {
      return Response.json(
        { success: false, error: 'All required acknowledgements must be accepted' } satisfies ApiResponse,
        { status: 400 },
      );
    }

    // Get booking
    const booking = await db.prepare('SELECT * FROM bookings WHERE id = ?').bind(booking_id).first();
    if (!booking) {
      return Response.json({ success: false, error: 'Booking not found' } satisfies ApiResponse, { status: 404 });
    }

    const clientId = booking.client_id as string;
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const signedAt = new Date().toISOString();

    // Create consent form
    const consentId = crypto.randomUUID().replace(/-/g, '');
    await db.prepare(`
      INSERT INTO consent_forms (
        id, booking_id, client_id, full_name, date_of_birth,
        government_id_type, emergency_contact_name, emergency_contact_phone,
        has_allergies, allergies_detail, has_medical_conditions, medical_conditions_detail,
        is_pregnant, is_on_blood_thinners, has_skin_conditions, skin_conditions_detail,
        recent_alcohol, ack_age_18, ack_sober, ack_aftercare, ack_infection_risk,
        ack_no_guarantee, ack_photo_release, ack_final_design,
        signature_data, signed_at, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      consentId, booking_id, clientId, full_name, date_of_birth,
      government_id_type || null, emergency_contact_name || null, emergency_contact_phone || null,
      has_allergies ? 1 : 0, allergies_detail || null,
      has_medical_conditions ? 1 : 0, medical_conditions_detail || null,
      is_pregnant ? 1 : 0, is_on_blood_thinners ? 1 : 0,
      has_skin_conditions ? 1 : 0, skin_conditions_detail || null,
      recent_alcohol ? 1 : 0,
      ack_age_18 ? 1 : 0, ack_sober ? 1 : 0, ack_aftercare ? 1 : 0,
      ack_infection_risk ? 1 : 0, ack_no_guarantee ? 1 : 0,
      ack_photo_release ? 1 : 0, ack_final_design ? 1 : 0,
      signature_data, signedAt, ip, userAgent,
    ).run();

    // Update booking
    await db.prepare(`
      UPDATE bookings SET consent_signed = 1, consent_signed_at = ?, consent_ip = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(signedAt, ip, booking_id).run();

    // Update client medical info
    if (has_allergies && allergies_detail) {
      await db.prepare('UPDATE clients SET allergies = ?, updated_at = datetime(\'now\') WHERE id = ?')
        .bind(allergies_detail, clientId).run();
    }

    // Audit log
    await db.prepare(`
      INSERT INTO audit_log (id, entity_type, entity_id, action, actor)
      VALUES (?, 'consent', ?, 'signed', ?)
    `).bind(crypto.randomUUID().replace(/-/g, ''), consentId, ip).run();

    return Response.json({
      success: true,
      data: { consent_id: consentId, signed_at: signedAt },
      message: 'Consent form signed successfully',
    } satisfies ApiResponse);
  } catch (err) {
    console.error('Consent error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' } satisfies ApiResponse,
      { status: 500 },
    );
  }
};

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const bookingId = url.searchParams.get('booking_id');

    if (!bookingId) {
      return Response.json({ success: false, error: 'booking_id required' } satisfies ApiResponse, { status: 400 });
    }

    const consent = await db.prepare('SELECT * FROM consent_forms WHERE booking_id = ?').bind(bookingId).first();

    return Response.json({
      success: true,
      data: consent || null,
    } satisfies ApiResponse);
  } catch (err) {
    return Response.json({ success: false, error: 'Internal server error' } satisfies ApiResponse, { status: 500 });
  }
};
