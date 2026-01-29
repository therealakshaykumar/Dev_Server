import { rateLimit } from "express-rate-limit";
export const RateLimiter = rateLimit({
    windowMs: 1000,
    max: 5,
});
