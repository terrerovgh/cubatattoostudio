export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url, locals }) => {
  try {
    const email = url.searchParams.get('email');
    if (!email) {
      return Response.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const env = locals.runtime.env;
    const db = env.DB;

    const client = await db.prepare('SELECT id, email, first_name, last_name, phone, date_of_birth FROM clients WHERE email = ?')
      .bind(email)
      .first();

    if (client) {
      return Response.json({ success: true, data: { client } });
    }

    return Response.json({ success: true, data: { client: null } });
  } catch (error) {
    console.error('Client lookup error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
};
