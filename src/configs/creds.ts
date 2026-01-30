import dotenv from 'dotenv'
import { CookieOptions } from 'express';
dotenv.config({
    quiet: true,
});

export namespace App{
    export const PORT = process.env.PORT || 7777
    export const LOG_TYPE = process.env.LOG_TYPE || 'console'
    export const JWT_SECRET = process.env.JWT_SECRET
    export const EXPIRES_IN = "7d"
    export const COOKIE_OPTIONS = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    } as CookieOptions;
}

export namespace DB{
    export const MONGO_URI = process.env.MONGO_URI
}