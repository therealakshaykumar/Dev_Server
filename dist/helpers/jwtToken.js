import jwt from "jsonwebtoken";
import { App } from "../configs/creds.js";
export const generateToken = async (payload) => {
    const token = jwt.sign(payload, App.JWT_SECRET, {
        expiresIn: App.EXPIRES_IN,
    });
    return token;
};
export const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, App.JWT_SECRET);
        return decoded;
    }
    catch (err) {
        return null;
    }
};
