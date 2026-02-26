import dotenv from 'dotenv'
import { CookieOptions } from 'express';
dotenv.config({
    quiet: true,
});

export namespace App{
    export const PORT = process.env.PORT || 7777
    export const LOG_TYPE = process.env.LOG_TYPE || 'console'
    export const JWT_SECRET = process.env.JWT_SECRET
    export const NODE_ENV = process.env.NODE_ENV
    export const EXPIRES_IN = "7d"
    const isProduction = NODE_ENV === 'production';
    export const COOKIE_OPTIONS = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    } as CookieOptions;
}

export namespace DB{
    export const MONGO_URI = process.env.MONGO_URI
}

export namespace Cloudinary{
    export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ''
    export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || ''
    export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || ''
}

export namespace GenAI{
    export const GENAI_API_KEY = process.env.GENAI_API_KEY || ''
}

export namespace AWS{
    export const AWS_BUCKET = process.env.AWS_BUCKET || ''  
    export const AWS_REGION = process.env.AWS_REGION || ''  
    export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || ''
    export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || ''
}