import APP from "./app.js";
import { connectDB } from "./configs/database.js";
import { Logger } from "./lib/logger.js";
import { App } from "./configs/creds.js";

// Connect DB and start server
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
