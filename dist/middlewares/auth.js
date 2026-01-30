import { verifyToken } from "../helpers/jwtToken.js";
import "../types/type.js";
import { Logger } from "../lib/logger.js";
export const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }
        const decoded = await verifyToken(token);
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
};
export const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }
        const decoded = await verifyToken(token);
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
};
