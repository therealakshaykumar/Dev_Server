var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { verifyToken } from "../helpers/jwtToken.js";
import "../types/type.js";
import { Logger } from "../lib/logger.js";
export const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }
        const decoded = yield verifyToken(token);
        if (!decoded) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        Logger.error("Authentication Error:", error);
        return res.status(500).send("Internal Server Error");
    }
});
export const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }
        const decoded = yield verifyToken(token);
        if (!decoded) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        if (!decoded.isAdmin) {
            return res.status(403).send("Access denied");
        }
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        Logger.error("Admin Authentication Error:", error);
        return res.status(500).send("Internal Server Error");
    }
});
