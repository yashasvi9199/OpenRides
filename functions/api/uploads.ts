import { z } from 'zod';

export interface Env {
  BUCKET: R2Bucket;
}

// Magic number validation for secure server-side MIME type check
function validateMagicNumbers(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 4));
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return true;
  }
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return true;
  }
  return false;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const contentType = request.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Content-type must be multipart/form-data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File size exceeds 5MB limit' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const buffer = await file.arrayBuffer();
    if (!validateMagicNumbers(buffer)) {
      return new Response(JSON.stringify({ error: 'MIME type mismatch: Only PNG and JPEG allowed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate secure filename using UUID
    const fileId = crypto.randomUUID();
    const extension = file.type === 'image/png' ? 'png' : 'jpg';
    const filename = `${fileId}.${extension}`;

    // Store in Cloudflare R2 BUCKET
    await env.BUCKET.put(filename, buffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const locationUrl = `/api/downloads?file=${filename}`;
    return new Response(JSON.stringify({ fileId: filename, location: locationUrl }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Location': locationUrl,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
