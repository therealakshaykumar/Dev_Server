import express from "express";
import helmet from "helmet";
import compression from "compression";
import cookies from "cookie-parser";
import { createServer } from "http";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import { App } from "./configs/creds.js";
import { Logger } from "./lib/logger.js";
import { AUTH_ROUTER } from "./routes/auth.js";
import { USER_ROUTER } from "./routes/user.js";
import { CONNECTION_ROUTER } from "./routes/connection.js";
import { apiLimiter, authLimiter, globalLimiter } from "./lib/rate-limiter.js";
import { GENAI_ROUTER } from "./routes/genAI.js";
import {
  COMPRESSION_OPTIONS,
  CORS_OPTIONS,
  HELMET_OPTIONS,
  JSON_OPTIONS,
} from "./configs/constants.js";
import {
  getSlowAPI,
  globalErrorHandler,
  healthCheck,
  startServer,
} from "./helpers/global.js";

const APP = express();
const SERVER = createServer(APP);

APP.set("trust proxy", 1);

APP.use(helmet(HELMET_OPTIONS));
APP.use(compression(COMPRESSION_OPTIONS));
APP.use(express.json(JSON_OPTIONS));
APP.use(express.urlencoded({ extended: true, limit: "10kb" }));
APP.use(mongoSanitize());
APP.use(hpp());
APP.use(cors(CORS_OPTIONS));
APP.use(cookies());
APP.use(globalLimiter);

APP.get("/", healthCheck);

APP.use(getSlowAPI);
APP.use("/auth", authLimiter, AUTH_ROUTER);
APP.use("/user", apiLimiter, USER_ROUTER);
APP.use("/connection", apiLimiter, CONNECTION_ROUTER);
APP.use("/ai", apiLimiter, GENAI_ROUTER);

APP.use(globalErrorHandler);

startServer(SERVER, Number(App.PORT));

process.on("uncaughtException", (err) => {
  Logger.error("There was an uncaught error", err);
});

process.on("unhandledRejection", (reason, promise) => {
  Logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default APP;
