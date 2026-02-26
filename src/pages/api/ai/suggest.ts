export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * AI Suggestion endpoint — uses Workers AI to generate contextual suggestions.
 *
 * POST /api/ai/suggest
 * Body: { type: 'aftercare' | 'reply' | 'description', context: string }
 *
 * Types:
 *  - aftercare: Generate aftercare instructions based on tattoo details
 *  - reply: Suggest a chat reply based on conversation context
 *  - description: Generate a tattoo description from keywords/style
 */
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

    const { type, context: userContext } = body as {
      type: 'aftercare' | 'reply' | 'description';
      context: string;
    };

    if (!type || !userContext) {
      return Response.json(
        { success: false, error: 'Missing required fields: type, context' },
        { status: 400 },
      );
    }

    const validTypes = ['aftercare', 'reply', 'description'];
    if (!validTypes.includes(type)) {
      return Response.json(
        { success: false, error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 },
      );
    }

    const systemPrompts: Record<string, string> = {
      aftercare: `You are a professional tattoo aftercare advisor for Cuba Tattoo Studio.
Generate clear, concise aftercare instructions based on the tattoo details provided.
Include washing, moisturizing, sun protection, and healing timeline advice.
Keep it friendly and professional. Respond in 3-5 bullet points.`,

      reply: `You are a helpful assistant for Cuba Tattoo Studio artists.
Suggest a professional, friendly reply to the client's message based on the conversation context.
Keep it brief (1-3 sentences), warm, and helpful. Match the studio's upscale but approachable tone.`,

      description: `You are a creative tattoo description writer for Cuba Tattoo Studio.
Based on the keywords and style provided, write a compelling 2-3 sentence description
for a tattoo design listing. Make it vivid and appealing to potential clients.`,
    };

    const ai = env.AI;

    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompts[type] },
        { role: 'user', content: userContext },
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    // Workers AI returns { response: string } for text generation
    const result = (response as { response?: string }).response || '';

    return Response.json({
      success: true,
      data: {
        suggestion: result.trim(),
        type,
      },
    });
  } catch (err) {
    console.error('AI suggest error:', err);
    return Response.json(
      { success: false, error: 'AI service temporarily unavailable' },
      { status: 500 },
    );
  }
};
