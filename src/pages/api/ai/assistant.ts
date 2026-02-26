export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * AI Assistant endpoint — provides studio-specific Q&A assistance.
 *
 * POST /api/ai/assistant
 * Body: {
 *   question: string,
 *   context?: { role?: string, artist_id?: string }
 * }
 *
 * Uses Workers AI to answer questions about:
 *  - Studio policies and pricing
 *  - Booking procedures
 *  - Tattoo care and preparation
 *  - General tattoo knowledge
 */

const STUDIO_CONTEXT = `You are the AI assistant for Cuba Tattoo Studio, a professional tattoo studio.

Studio Information:
- Located in a professional studio environment
- Artists: David (owner, specializes in realistic and fine-line work), Nina (specializes in geometric and watercolor), Karli (specializes in traditional and neo-traditional)
- Services: Custom tattoos, flash designs, cover-ups, touch-ups, consultations
- Booking: Online booking available, deposits required for appointments
- Aftercare: Professional aftercare guidance provided with every tattoo

Guidelines:
- Be helpful, professional, and friendly
- If asked about specific pricing, mention that prices vary by design and to book a consultation
- Encourage clients to book consultations for custom work
- Never provide medical advice beyond standard aftercare
- Keep responses concise (2-4 sentences unless more detail is needed)`;

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime.env;

  try {
    const body = await context.request.json().catch(() => null);

    if (!body) {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { question, context: userContext } = body as {
      question: string;
      context?: { role?: string; artist_id?: string };
    };

    if (!question || question.trim().length === 0) {
      return Response.json(
        { success: false, error: 'Missing required field: question' },
        { status: 400 },
      );
    }

    if (question.length > 2000) {
      return Response.json(
        { success: false, error: 'Question too long. Maximum 2000 characters.' },
        { status: 400 },
      );
    }

    const ai = env.AI;

    // Build system message with role context
    let systemMessage = STUDIO_CONTEXT;
    if (userContext?.role === 'artist') {
      systemMessage += '\n\nThe user asking is a studio artist. You can provide more technical details and business information.';
    } else if (userContext?.role === 'admin') {
      systemMessage += '\n\nThe user asking is a studio admin. You can provide detailed business metrics, operational advice, and technical information.';
    }

    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: question.trim() },
      ],
      max_tokens: 1024,
      temperature: 0.6,
    });

    const result = (response as { response?: string }).response || '';

    return Response.json({
      success: true,
      data: {
        answer: result.trim(),
        model: 'llama-3.1-8b-instruct',
      },
    });
  } catch (err) {
    console.error('AI assistant error:', err);
    return Response.json(
      { success: false, error: 'AI service temporarily unavailable' },
      { status: 500 },
    );
  }
};
