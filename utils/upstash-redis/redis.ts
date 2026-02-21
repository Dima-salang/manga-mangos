import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = Redis.fromEnv();

export const rate = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1s"),
    prefix: "jikan",
});