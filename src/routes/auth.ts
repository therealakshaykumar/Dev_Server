import { Router, Request, Response } from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../middlewares/wrapper.js";
import { checkAbusePatterns } from "../lib/validate.js";
import validator from "validator";
import { App } from "../configs/creds.js";
import { generateToken } from "../helpers/jwtToken.js";

const ROUTER = Router();

ROUTER.post(
  "/signup",
  asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !email || !password) {
      return res.status(400).send("Missing required fields");
    }
    if (
      checkAbusePatterns(firstName) ||
      checkAbusePatterns(lastName) ||
      checkAbusePatterns(email) ||
      checkAbusePatterns(password)
    ) {
      return res.status(400).send("Invalid input detected");
    }
    if (!validator.isEmail(email)) {
      return res.status(401).send("Invalid email address");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      firstName,
      password: hashedPassword,
      lastName: lastName || "",
      isAdmin: false,
    });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  }),
);

ROUTER.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
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

    const USER = await User.findOne({ email }).select("+password").lean();
    if (!USER) {
      throw new Error("Invalid credentials");
    }

    const IS_VALID_PASSWORD = await bcrypt.compare(password, USER.password);
    if (!IS_VALID_PASSWORD) {
      return res.status(401).send("Invalid credentials");
    }

    const TOKEN = await generateToken({ id: USER._id, isAdmin: USER.isAdmin });
    const {password:p, ...userData} = USER;

    res.cookie("token", TOKEN, App.COOKIE_OPTIONS);
    res.status(200).json({
      message: "Login successful",
      data: userData
    });
  }),
);

ROUTER.post('/logout', asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}));

export const AUTH_ROUTER = ROUTER;
