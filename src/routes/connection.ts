import { Router, Request, Response } from "express";
import { userAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/wrapper.js";
import { User } from "../models/user.js";
import { Connection, CONNECTION_STATUSES } from "../models/connection.js";
import mongoose from "mongoose";

const ROUTER = Router();
ROUTER.use(userAuth);

ROUTER.post("/connect/:status/:toUserId", asyncHandler(async (req: Request, res: Response) => {
    const { status, toUserId } = req.params;
    const validStatuses = [...CONNECTION_STATUSES].filter(s => s == 'ignored' || s == 'interested');
    if (!validStatuses.includes(status as any)) {
        return res.status(400).json({ message: "Invalid connection status" });
    }

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

ROUTER.post('/review/:status/:requestId', asyncHandler(async (req: Request, res: Response) => {
    const { status, requestId } = req.params;
    const validStatuses = [...CONNECTION_STATUSES].filter(s => s == 'accepted' || s == 'rejected');   
    if (!validStatuses.includes(status as any)) {
        return res.status(400).json({ message: "Invalid connection status" });
    }   
    if (!req.userId || !requestId) {
        throw new Error("Missing user identification");
    }
    const CONNECTION = await Connection.findOne({
        _id: requestId,
        toUserId: req.userId,
        status: 'interested'
    } as any);
    if (!CONNECTION) { 
        return res.status(404).json({ message: "Connection request not found" });
    }
    CONNECTION.status = status as any;
    await CONNECTION.save();
    res.status(200).json({ message: `Connection ${status}` });
}));

ROUTER.get('/requests', asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) {
        throw new Error("Missing user identification");
    }   
    const REQUESTS = await Connection.find({
        toUserId: req.userId,
        status: 'interested'
    } as any).populate('fromUserId', '-password -__v').lean();
    res.status(200).json({ requests: REQUESTS });
}));

ROUTER.get('/connections', asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) {
        throw new Error("Missing user identification");
    }
    const CONNECTIONS = await Connection.find({
        $or: [
            { fromUserId: req.userId, status: 'accepted' }, 
            { toUserId: req.userId, status: 'accepted' }
        ]
    } as any).populate('fromUserId', '-password -__v').populate('toUserId', '-password -__v').lean();
    res.status(200).json({ connections: CONNECTIONS });
}));

ROUTER.get('/feed', asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) {
        throw new Error("Missing user identification");
    }

    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;
    limit = Math.min(limit, 50);
    const skip = (page - 1) * limit;

    const existingConnections = await Connection.find({
        $or: [
            { fromUserId: req.userId },
            { toUserId: req.userId }
        ]
    } as any).select('fromUserId toUserId').lean();

    const excludedUserIds = new Set<string>();
    excludedUserIds.add(String(req.userId));

    existingConnections.forEach(conn => {
        excludedUserIds.add(String(conn.fromUserId));
        excludedUserIds.add(String(conn.toUserId));
    });

    const excludedObjectIds = Array.from(excludedUserIds).map(
        id => new mongoose.Types.ObjectId(id)
    );

    const feedUsers = await User.find({
        _id: { $nin: excludedObjectIds }
    })
    .select("-password -__v")
    .skip(skip)
    .limit(limit)
    .lean();

    const totalCount = await User.countDocuments({
        _id: { $nin: excludedObjectIds }
    });

    res.status(200).json({ 
        feed: feedUsers,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalUsers: totalCount,
            hasNextPage: skip + feedUsers.length < totalCount,
            hasPrevPage: page > 1
        }
    });
}));

ROUTER.get('/review-ignored', asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) {
        throw new Error("Missing user identification");
    }
    const REVIEWS = await Connection.find({
        toUserId: String(req.userId),
        status: 'ignored'
    })
    .populate('fromUserId', '-password -__v')
    .populate('toUserId', '-password -__v')
    .lean();

    res.status(200).json({ reviews: REVIEWS });
}));

ROUTER.post('/reviews/:status/:requestId', asyncHandler(async (req: Request, res: Response) => {
    const { status, requestId } = req.params;

    const validStatuses = ['accepted', 'rejected'];
    if (!validStatuses.includes(String(status))) {
        return res.status(400).json({ message: "Invalid connection status" });
    }

    if (!req.userId || !requestId) {
        throw new Error("Missing user identification");
    }

    // ✅ Find ignored request where current user is the receiver
    const CONNECTION = await Connection.findOne({
        _id: String(requestId),
        toUserId: String(req.userId),
        status: 'ignored'
    });

    if (!CONNECTION) {
        return res.status(404).json({ message: "Connection request not found" });
    }

    CONNECTION.status = status as any;
    await CONNECTION.save();
    res.status(200).json({ message: `Connection ${status}` });
}));

export const CONNECTION_ROUTER = ROUTER;