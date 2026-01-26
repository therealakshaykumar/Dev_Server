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

const APP = express();
APP.use(helmet());
APP.use(compression());
APP.use(express.json());
APP.use(cookies());

APP.use("/auth", AUTH_ROUTER);
APP.use("/user", USER_ROUTER);
APP.use("/connection", CONNECTION_ROUTER);

APP.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

connectDB()
  .then(() => {
    Logger.info(`🛢️  DB Connected Successfully 🛢️`);
    APP.listen(App.PORT, () => {
      Logger.info(`🔥 Sever is running on port : ${App.PORT} 🔥`);
    });
  })
  .catch((err) => {
    Logger.error("Error connecting DB 😕", err);
  });
