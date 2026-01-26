import { Router, Request, Response } from "express";
import { userAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/wrapper.js";
import { User } from "../models/user.js";
import { Connection } from "../models/connection.js";
import mongoose from "mongoose";

const ROUTER = Router();
ROUTER.use(userAuth);

ROUTER.post("/connect/:status/:toUserId", asyncHandler(async (req: Request, res: Response) => {
    const { status, toUserId } = req.params;

    if (!req.userId || !toUserId) {
        throw new Error("Missing user identification");
    }
    
    if (!mongoose.Types.ObjectId.isValid(String(toUserId))) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }
    
    if(toUserId === String(req.userId)){
        return res.status(400).send("Cannot connect with yourself");
    }
    const USER = await User.findById(toUserId).select("-password -__v").lean();
    if (!USER) {
        return res.status(404).send("User not found");
    }
    const EXISTING_CONNECTION = await Connection.findOne({
        $or: [
            { fromUserId: req.userId, toUserId: toUserId },
            { fromUserId: toUserId, toUserId: req.userId }
        ]
    } as any);
    if(EXISTING_CONNECTION){
        return res.status(400).json({ message: "Connection request already exists"});
    }
    const CONNECTION = new Connection({
        fromUserId: req.userId,
        toUserId: toUserId,
        status: status
    })
    await CONNECTION.save();
    res.status(200).json({ message: `Connection ${status}`});
}));


export const CONNECTION_ROUTER = ROUTER;