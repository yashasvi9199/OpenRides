export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

// In-memory stores for rate limiting
const fixedWindowStore = new Map<string, { count: number; expiresAt: number }>();
const tokenBucketStore = new Map<string, { tokens: number; lastRefilled: number }>();

/**
 * Fixed Window rate limiter for sensitive endpoints (e.g. Auth/Reset)
 * Enforces 1 request per 120 seconds for strict endpoints
 */
export function checkFixedWindowLimit(
  key: string,
  windowSeconds = 120,
  maxRequests = 1
): RateLimitResult {
  try {
    const now = Math.floor(Date.now() / 1000);
    const record = fixedWindowStore.get(key);

    if (!record || now >= record.expiresAt) {
      fixedWindowStore.set(key, { count: 1, expiresAt: now + windowSeconds });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    if (record.count >= maxRequests) {
      return { allowed: false, retryAfterSeconds: record.expiresAt - now };
    }

    record.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  } catch {
    // Fail-open in case of caching failure to preserve availability
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

/**
 * Token Bucket rate limiter for general traffic
 * Capacity: 30, Refills at 30 tokens per 60s (0.5 token/second)
 */
export function checkTokenBucketLimit(
  key: string,
  capacity = 30,
  refillSeconds = 60
): RateLimitResult {
  try {
    const now = Date.now();
    const bucket = tokenBucketStore.get(key) || { tokens: capacity, lastRefilled: now };

    const elapsedMs = now - bucket.lastRefilled;
    const refillRate = capacity / (refillSeconds * 1000); // tokens per millisecond
    const refilledTokens = Math.min(capacity, bucket.tokens + (elapsedMs * refillRate));

    if (refilledTokens < 1) {
      const waitTimeMs = (1 - refilledTokens) / refillRate;
      return { allowed: false, retryAfterSeconds: Math.ceil(waitTimeMs / 1000) };
    }

    tokenBucketStore.set(key, {
      tokens: refilledTokens - 1,
      lastRefilled: now,
    });

    return { allowed: true, retryAfterSeconds: 0 };
  } catch {
    // Fail-open
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
