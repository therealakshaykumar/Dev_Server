var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import helmet from "helmet";
import compression from "compression";
import cookies from "cookie-parser";
import { connectDB } from "./configs/database.js";
import { Logger } from "./lib/logger.js";
import { AUTH_ROUTER } from "./routes/auth.js";
import { USER_ROUTER } from "./routes/user.js";
import { CONNECTION_ROUTER } from "./routes/connection.js";
import { RateLimiter } from "./lib/rate-limiter.js";
import cors from 'cors';
const APP = express();
APP.use(helmet());
APP.use(compression());
APP.use(express.json());
APP.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));
APP.use(cookies());
APP.use(RateLimiter);
APP.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB();
        next();
    }
    catch (error) {
        Logger.error("Database connection failed", error);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
}));
APP.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        if (duration > 5000) {
            Logger.warn(`Slow API: ${req.method} ${req.path} took ${duration}ms`);
        }
    });
    next();
});
APP.get("/", (req, res) => {
    res.send("Health OK!");
});
APP.use("/auth", AUTH_ROUTER);
APP.use("/user", USER_ROUTER);
APP.use("/connection", CONNECTION_ROUTER);
APP.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
process.on("uncaughtException", (err) => {
    Logger.error("There was an uncaught error", err);
});
process.on("unhandledRejection", (reason, promise) => {
    Logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
export default APP;
