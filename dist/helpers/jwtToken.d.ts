import jwt from "jsonwebtoken";
export declare const generateToken: (payload: object) => Promise<string>;
export declare const verifyToken: (token: string) => Promise<string | jwt.JwtPayload | null>;
