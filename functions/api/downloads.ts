// * Cloudflare Pages Function: Handles R2 bucket downloads with ETag and Cache-Control headers.
import { z } from 'zod';

export interface Env {
  BUCKET: R2Bucket;
}

const QuerySchema = z.object({
  file: z.string().regex(/^[0-9a-fA-F-]{36}\.(png|jpg)$/, 'Invalid filename format'),
});

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const fileParam = url.searchParams.get('file');

    const result = QuerySchema.safeParse({ file: fileParam });
    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.issues[0].message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { file } = result.data;
    const object = await env.BUCKET.get(file);

    if (!object) {
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, {
      headers,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
