import { NextFunction, Request, Response } from "express";
import { Logger } from "../lib/logger.js";
import { connectDB } from "../configs/database.js";
import { initSocket } from "../lib/socket.js";
import { IncomingMessage, Server, ServerResponse } from "http";

export const getSlowAPI = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    if (duration > 5000) {
      Logger.warn(`Slow API: ${req.method} ${req.path} took ${duration}ms`);
    }
  });

  next();
}

export const healthCheck = async (req: Request, res: Response) => {
  res.send("Health OK!");
}

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  if(process.env.NODE_ENV !== "production") console.log(err)
  Logger.error(`Error: ${err.message}`, { path: req.path, method: req.method });
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;
  res.status(err.status || 500).json({
    success: false,
    message,
  });
}


export const startServer = async (server: Server,port:number) => {
  try {
    await connectDB();
    Logger.info("🔥 Database connection successful");
    await initSocket(server);
    Logger.info("🔥 Socket connection initiated");
  } catch (error) {
    Logger.error("Unable to connect to database:", error);
    process.exit(1);
  }

  server.listen(port, () => {
    Logger.info(`🔥 Server is running on port ${port}`);
  });
};