import { redis } from "./redis";

export type RateLimitOptions = {
  key: string;
  limit: number;
  windowSec: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSec: number;
};

// Fixed window counter. The first hit in a window sets the expiry.
export async function rateLimit({ key, limit, windowSec }: RateLimitOptions): Promise<RateLimitResult> {
  const redisKey = `rl:${key}`;
  const count = await redis.incr(redisKey);

  if (count === 1) {
    await redis.expire(redisKey, windowSec);
  }

  if (count <= limit) {
    return { allowed: true, retryAfterSec: 0 };
  }

  const ttl = await redis.ttl(redisKey);
  return { allowed: false, retryAfterSec: ttl > 0 ? ttl : windowSec };
}
