
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis;
let ratelimit: Ratelimit;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(5, "10 m"), // Allow 5 requests per 10 minutes
        analytics: true,
        prefix: "@upstash/ratelimit",
    });
}

/**
 * Checks if a given identifier has exceeded the rate limit.
 * Throws an error if the rate limit is exceeded.
 * @param identifier A unique identifier for the user/request (e.g., IP address).
 */
export async function checkRateLimit(identifier: string) {
    if (!ratelimit) {
        // If Upstash is not configured, we can either fail open (do nothing)
        // or fail closed (throw an error). For development, we'll log a warning.
        if (process.env.NODE_ENV !== 'production') {
            console.warn("Rate limiting is disabled. UPSTASH environment variables are not set.");
        }
        return;
    }
    
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
        throw new Error("You have reached the request limit. Please try again in 10 minutes.");
    }
}
