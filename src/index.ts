import APP from "./app.js";
import { connectDB } from "./configs/database.js";
import { Logger } from "./lib/logger.js";
import { App } from "./configs/creds.js";

// Only run in non-Vercel environment
if (process.env.VERCEL !== "1") {
  connectDB()
    .then(() => {
      Logger.info(`🛢️  DB Connected Successfully 🛢️`);
      APP.listen(App.PORT, () => {
        Logger.info(`🔥 Server is running on port: ${App.PORT} 🔥`);
      });
    })
    .catch((err) => {
      Logger.error("Error connecting DB 😕", err);
    });
}

export default APP;