var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Router } from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../middlewares/wrapper.js";
import { checkAbusePatterns } from "../lib/validate.js";
import validator from "validator";
import { App } from "../configs/creds.js";
import { generateToken } from "../helpers/jwtToken.js";
const ROUTER = Router();
ROUTER.post("/signup", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !email || !password) {
        return res.status(400).send("Missing required fields");
    }
    if (checkAbusePatterns(firstName) ||
        checkAbusePatterns(lastName) ||
        checkAbusePatterns(email) ||
        checkAbusePatterns(password)) {
        return res.status(400).send("Invalid input detected");
    }
    if (!validator.isEmail(email)) {
        return res.status(401).send("Invalid email address");
    }
    const existingUser = yield User.findOne({ email });
    if (existingUser) {
        return res.status(400).send("Email already in use");
    }
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(password, salt);
    const user = new User({
        email,
        firstName,
        password: hashedPassword,
        lastName: lastName || "",
        isAdmin: false,
    });
    yield user.save();
    res.status(201).json({ message: "User created successfully" });
})));
ROUTER.post("/login", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Please provide email and password");
    }
    if (checkAbusePatterns(email) || checkAbusePatterns(password)) {
        return res.status(400).send("Invalid input detected");
    }
    if (!validator.isEmail(email)) {
        return res.status(401).send("Invalid email address");
    }
    const USER = yield User.findOne({ email }).select("+password").lean();
    if (!USER) {
        throw new Error("Invalid credentials");
    }
    const IS_VALID_PASSWORD = yield bcrypt.compare(password, USER.password);
    if (!IS_VALID_PASSWORD) {
        return res.status(401).send("Invalid credentials");
    }
    const TOKEN = yield generateToken({ id: USER._id, isAdmin: USER.isAdmin });
    const { password: p } = USER, userData = __rest(USER, ["password"]);
    res.cookie("token", TOKEN, App.COOKIE_OPTIONS);
    res.status(200).json({
        message: "Login successful",
        data: userData
    });
})));
ROUTER.post('/logout', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token', App.COOKIE_OPTIONS);
    res.status(200).json({ message: 'Logout successful' });
})));
export const AUTH_ROUTER = ROUTER;
