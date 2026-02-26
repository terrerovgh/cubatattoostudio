export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const session = locals.session;

    if (!session) {
      return Response.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        session: {
          user_id: session.user_id,
          email: session.email,
          role: session.role,
          artist_id: session.artist_id,
          client_id: session.client_id,
          display_name: session.display_name,
          created_at: session.created_at,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Session check error:', err);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
};
