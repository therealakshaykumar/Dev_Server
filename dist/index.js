var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import APP from "./app.js";
import { connectDB } from "./configs/database.js";
import { Logger } from "./lib/logger.js";
import { App } from "./configs/creds.js";
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB();
        Logger.info("Database connection successful");
    }
    catch (error) {
        Logger.error("Unable to connect to database:", error);
        process.exit(1);
    }
    APP.listen(App.PORT, () => {
        Logger.info(`Server is running on port ${App.PORT}`);
    });
});
startServer();
