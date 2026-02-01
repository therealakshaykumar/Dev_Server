var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import { App } from "../configs/creds.js";
export const generateToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt.sign(payload, App.JWT_SECRET, {
        expiresIn: App.EXPIRES_IN,
    });
    return token;
});
export const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jwt.verify(token, App.JWT_SECRET);
        return decoded;
    }
    catch (err) {
        return null;
    }
});
