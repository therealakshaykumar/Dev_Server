import dotenv from 'dotenv';
dotenv.config({
    quiet: true,
});
export var App;
(function (App) {
    App.PORT = process.env.PORT || 3000;
    App.LOG_TYPE = process.env.LOG_TYPE || 'console';
    App.JWT_SECRET = process.env.JWT_SECRET;
    App.EXPIRES_IN = "7d";
    App.COOKIE_OPTIONS = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
})(App || (App = {}));
export var DB;
(function (DB) {
    DB.MONGO_URI = process.env.MONGO_URI;
})(DB || (DB = {}));
