var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { User } from "../models/user.js";
import { asyncHandler } from "../middlewares/wrapper.js";
import { adminAuth, userAuth } from "../middlewares/auth.js";
import bcrypt from "bcrypt";
const ROUTER = Router();
ROUTER.use(userAuth);
ROUTER.get("/users", adminAuth, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const USERS = yield User.find().select("-__v").lean();
    res.json(USERS);
})));
ROUTER.get("/profile", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const USER = yield User.findById(req.userId).select("-password -__v").lean();
    if (!USER) {
        return res.status(404).send("User not found");
    }
    res.json(USER);
})));
ROUTER.post('/change-password', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).send("Please provide old and new passwords");
    }
    if (oldPassword === newPassword) {
        return res.status(400).send("New password must be different from old password");
    }
    const USER = yield User.findById(req.userId).select("+password");
    if (!USER) {
        return res.status(404).send("User not found");
    }
    const isMatch = yield bcrypt.compare(oldPassword, USER.password);
    if (!isMatch) {
        return res.status(401).send("Password is incorrect");
    }
    const salt = yield bcrypt.genSalt(10);
    const hashedPassword = yield bcrypt.hash(newPassword, salt);
    USER.password = hashedPassword;
    yield USER.save();
    res.status(200).json({ message: "Password changed successfully" });
})));
export const USER_ROUTER = ROUTER;
