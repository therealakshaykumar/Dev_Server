import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import compression from "compression";
import cookies from "cookie-parser";

import { App } from "./configs/creds.js";
import { connectDB } from "./configs/database.js";
import { Logger } from "./lib/logger.js";
import { AUTH_ROUTER } from "./routes/auth.js";
import { USER_ROUTER } from "./routes/user.js";
import { CONNECTION_ROUTER } from "./routes/connection.js";
import { RateLimiter } from "./lib/rate-limiter.js";
import cors from 'cors';
import { GENAI_ROUTER } from "./routes/genAI.js";

const APP = express();
APP.set("trust proxy", 1);
APP.use(helmet());
APP.use(compression());
APP.use(express.json());
APP.use(cors({
  origin: ['http://localhost:5173', 'https://gitogether.vercel.app'],
  credentials: true,
}));
APP.use(cookies());
APP.use(RateLimiter);

APP.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (duration > 5000) {
      Logger.warn(`Slow API: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
});


APP.get("/", (req: Request, res: Response) => {
  res.send("Health OK!");
});

APP.use("/auth", AUTH_ROUTER);
APP.use("/user", USER_ROUTER);
APP.use("/connection", CONNECTION_ROUTER);
APP.use("/ai", GENAI_ROUTER);

APP.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    Logger.info("Database connection successful");
  } catch (error) {
    Logger.error("Unable to connect to database:", error);
    process.exit(1);
  }

  APP.listen(App.PORT, () => {
    Logger.info(`Server is running on port ${App.PORT}`);
  });
};
startServer();

process.on("uncaughtException", (err) => {
  Logger.error("There was an uncaught error", err);
});

process.on("unhandledRejection", (reason, promise) => {
  Logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default APP;
