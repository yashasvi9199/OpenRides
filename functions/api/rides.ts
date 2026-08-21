import { z } from 'zod';

export interface Env {
  DB: D1Database;
}

const QuerySchema = z.object({
  id: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || undefined;
    const limit = url.searchParams.get('limit') || undefined;
    const offset = url.searchParams.get('offset') || undefined;

    const result = QuerySchema.safeParse({ id, limit, offset });
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.issues[0].message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const params = result.data;
    if (params.id) {
      const ride = await env.DB.prepare('SELECT * FROM rides WHERE id = ?')
        .bind(params.id)
        .first();

      if (!ride) {
        return new Response(JSON.stringify({ error: 'Ride not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(ride), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare('SELECT * FROM rides LIMIT ? OFFSET ?')
      .bind(params.limit, params.offset)
      .all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
