import { CookieOptions } from 'express';
export declare namespace App {
    const PORT: string | number;
    const LOG_TYPE: string;
    const JWT_SECRET: string | undefined;
    const EXPIRES_IN = "7d";
    const COOKIE_OPTIONS: CookieOptions;
}
export declare namespace DB {
    const MONGO_URI: string | undefined;
}
