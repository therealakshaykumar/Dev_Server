import { Router, Request, Response } from "express";
import { User } from "../models/user.js";
import { asyncHandler } from "../middlewares/wrapper.js";
import { adminAuth, userAuth } from "../middlewares/auth.js";
import bcrypt from "bcrypt";
import { upload } from "../lib/multer.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../lib/cloudinary.js";
import { isBirthdayToday } from "../helpers/birthday.js";

const ROUTER = Router();
ROUTER.use(userAuth);

ROUTER.get("/users", adminAuth, asyncHandler(async (req: Request, res: Response) => {
    const USERS = await User.find().select("-__v").lean();
    res.json(USERS);
}));

ROUTER.get("/profile/:userId", asyncHandler(async (req: Request, res: Response) => {
    const {userId} = req.params;
    const USER = await User.findById(String(userId)).select("-__v").lean();
    res.json(USER);
}));

ROUTER.get("/profile", asyncHandler(async (req: Request, res: Response) => {
    const USER = await User.findById(req.userId).select("-password -__v").lean();   
    if (!USER) {
        return res.status(404).send("User not found");
    }   
    res.json(USER);
}));

ROUTER.post('/change-password', asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).send("Please provide old and new passwords");
    }
    if (oldPassword === newPassword) {
        return res.status(400).send("New password must be different from old password");
    }
    const USER = await User.findById(req.userId).select("+password");
    if (!USER) {
        return res.status(404).send("User not found");
    }
    const isMatch = await bcrypt.compare(oldPassword, USER.password);
    if (!isMatch) {
        return res.status(401).send("Password is incorrect");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    USER.password = hashedPassword;
    await USER.save();
    res.status(200).json({ message: "Password changed successfully" });
}));

ROUTER.patch('/profile',upload.single('image'),asyncHandler(async (req: Request, res: Response) => {
    const {firstName,lastName,imageUrl,dob,gender,bio,githubUrl,linkedInUrl} = req.body;
    const updateData: any = {
        firstName,
        lastName,
        bio,
        gender,
        dob,
        githubUrl,
        linkedInUrl
    };
    if(new Date(dob) > new Date()) throw new Error("Date of birth cannot be a future date")
    if (req.file) {
        const currentUser = await User.findById(req.userId);
        
        if (currentUser?.imagePublicId) {
            await deleteFromCloudinary(currentUser.imagePublicId);
        }

        const { url, publicId } = await uploadToCloudinary(req.file.buffer);
        updateData.imageUrl = url;
        updateData.imagePublicId = publicId;
    }
    const USER = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).select("-password -__v");
    if (!USER) {
        return res.status(404).send("User not found");
    }
    res.json(USER);
}));

ROUTER.get('/birthday-today', asyncHandler(async (req: Request, res: Response) => {
    const USER = await User.findById(req.userId).select("dob").lean();
    if (!USER) {
        return res.status(404).send("User not found");
    }
    const isBirthday = isBirthdayToday(String(USER.dob));
    res.json({ isBirthdayToday: isBirthday });
}));

export const USER_ROUTER = ROUTER;
