import dotenv from 'dotenv';
dotenv.config({
    quiet: true,
});
export var App;
(function (App) {
    App.PORT = process.env.PORT || 7777;
    App.LOG_TYPE = process.env.LOG_TYPE || 'console';
    App.JWT_SECRET = process.env.JWT_SECRET;
    App.NODE_ENV = process.env.NODE_ENV;
    App.EXPIRES_IN = "7d";
    const isProduction = App.NODE_ENV === 'production';
    App.COOKIE_OPTIONS = {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
})(App || (App = {}));
export var DB;
(function (DB) {
    DB.MONGO_URI = process.env.MONGO_URI;
})(DB || (DB = {}));
export var Cloudinary;
(function (Cloudinary) {
    Cloudinary.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
    Cloudinary.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
    Cloudinary.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
})(Cloudinary || (Cloudinary = {}));
export var GenAI;
(function (GenAI) {
    GenAI.GENAI_API_KEY = process.env.GENAI_API_KEY || '';
})(GenAI || (GenAI = {}));
