import compression from "compression";
import { CorsOptions } from "cors";
import { Request, Response } from "express";
import { HelmetOptions } from "helmet";

export const CORS_URL = [
  "http://localhost:5173",
  "https://gitogether.vercel.app",
  "http://13.234.232.87",
  "http://13.234.232.87:7777",
  "http://13.234.232.87/api",
  "http://gitogether.duckdns.org",
  "https://gitogether.duckdns.org",
];

export const HELMET_OPTIONS = {
  xContentTypeOptions: true,
  frameguard: {
    action: "deny",
  },
  xXssProtection: true,
  hidePoweredBy: true,
  xDnsPrefetchControl: {
    allow: false,
  },
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
  permittedCrossDomainPolicies: {
    permittedPolicies: "none",
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
} as Readonly<HelmetOptions>;

export const COMPRESSION_OPTIONS = {
  // Only compress responses above 1KB
  threshold: 1024,
  level: 6,
  filter: (req: Request, res: Response) => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
  memLevel: 8,
} as compression.CompressionOptions;

export const JSON_OPTIONS = { limit: "10kb" } as const;

export const CORS_OPTIONS = {
  origin: CORS_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
} as CorsOptions;
