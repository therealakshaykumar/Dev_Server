import APP from "./app.js";
import { connectDB } from "./configs/database.js";
import { Logger } from "./lib/logger.js";
import { App } from "./configs/creds.js";

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