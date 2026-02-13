import { rateLimit } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                    // Only 10 login attempts
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 30,                    // 30 requests per minute
  message: {
    success: false,
    message: "API rate limit exceeded.",
  },
});

export const RateLimiter = rateLimit({
  windowMs: 1000,
  max: 10,
});
