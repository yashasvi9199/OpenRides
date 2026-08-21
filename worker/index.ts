// * Cloudflare Worker: Entry point for user registration, authentication, and security headers.
import { z } from 'zod';
import { checkTokenBucketLimit, checkFixedWindowLimit } from './rateLimiter';

export interface Env {
  DB: D1Database;
  APP_URL: string;
}

// Zod schemas for input validation
const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(72), // Enforces strict password character limit
  phone: z.string().min(10).max(15),
  role: z.enum(['rider', 'family', 'guest']).default('rider'),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') || '127.0.0.1';
}

function getSecurityHeaders(env: Env): Headers {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', env.APP_URL || '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Idempotency-Key');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none';");
  return headers;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const headers = getSecurityHeaders(env);
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 });
    }

    const url = new URL(request.url);
    const ip = getClientIP(request);

    // Apply General Rate Limiter (Token Bucket: 30req/60s)
    const generalLimit = checkTokenBucketLimit(ip);
    if (!generalLimit.allowed) {
      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers,
      });
    }

    try {
      if (url.pathname === '/api/auth/register' && request.method === 'POST') {
        const registerLimit = checkFixedWindowLimit(`register-${ip}`);
        if (!registerLimit.allowed) {
          headers.set('Content-Type', 'application/json');
          return new Response(JSON.stringify({ error: `Please wait ${registerLimit.retryAfterSeconds}s before registering again.` }), {
            status: 429,
            headers,
          });
        }

        const body = await request.json();
        const parseResult = RegisterSchema.safeParse(body);
        if (!parseResult.success) {
          headers.set('Content-Type', 'application/json');
          return new Response(JSON.stringify({ error: parseResult.error.issues[0].message }), {
            status: 400,
            headers,
          });
        }

        const { name, email, password, phone, role } = parseResult.data;
        const id = crypto.randomUUID();
        const qrToken = crypto.randomUUID();

        // Parameterized SQL query on D1 SQLite
        await env.DB.prepare(
          'INSERT INTO users (id, name, email, password_hash, phone, role, qr_token) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
          .bind(id, name, email, password, phone, role, qrToken)
          .run();

        headers.set('Content-Type', 'application/json');
        headers.set('Location', `/api/users/${id}`);
        return new Response(JSON.stringify({ id, name, email, role, qrToken }), {
          status: 201,
          headers,
        });
      }

      if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        const body = await request.json();
        const parseResult = LoginSchema.safeParse(body);
        if (!parseResult.success) {
          headers.set('Content-Type', 'application/json');
          return new Response(JSON.stringify({ error: parseResult.error.issues[0].message }), {
            status: 400,
            headers,
          });
        }

        const { email, password } = parseResult.data;
        const loginLimit = checkFixedWindowLimit(`login-${email}`);
        if (!loginLimit.allowed) {
          headers.set('Content-Type', 'application/json');
          return new Response(JSON.stringify({ error: `Rate limit exceeded. Try again in ${loginLimit.retryAfterSeconds}s.` }), {
            status: 429,
            headers,
          });
        }

        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
          .bind(email)
          .first();

        if (!user || user.password_hash !== password) {
          headers.set('Content-Type', 'application/json');
          return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
            status: 401,
            headers,
          });
        }

        headers.set('Content-Type', 'application/json');
        return new Response(JSON.stringify({ token: crypto.randomUUID(), user }), {
          status: 200,
          headers,
        });
      }

      if (url.pathname === '/api/auth/reset-password' && request.method === 'POST') {
        const resetLimit = checkFixedWindowLimit(`reset-${ip}`);
        if (!resetLimit.allowed) {
          headers.set('Content-Type', 'application/json');
          return new Response(JSON.stringify({ error: `Please wait ${resetLimit.retryAfterSeconds}s before requesting reset.` }), {
            status: 429,
            headers,
          });
        }

        const body = await request.json();
        const parseResult = ResetPasswordSchema.safeParse(body);
        if (!parseResult.success) {
          headers.set('Content-Type', 'application/json');
          return new Response(JSON.stringify({ error: parseResult.error.issues[0].message }), {
            status: 400,
            headers,
          });
        }

        headers.set('Content-Type', 'application/json');
        return new Response(JSON.stringify({ message: 'Password reset email initiated.' }), {
          status: 200,
          headers,
        });
      }

      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers,
      });
    } catch (err: any) {
      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
        status: 500,
        headers,
      });
    }
  },
};
