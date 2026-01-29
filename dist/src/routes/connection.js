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
import { userAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/wrapper.js";
import { User } from "../models/user.js";
import { Connection, CONNECTION_STATUSES } from "../models/connection.js";
import mongoose from "mongoose";
const ROUTER = Router();
ROUTER.use(userAuth);
ROUTER.post("/connect/:status/:toUserId", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, toUserId } = req.params;
    const validStatuses = [...CONNECTION_STATUSES].filter(s => s == 'ignored' || s == 'interested');
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid connection status" });
    }
    if (!req.userId || !toUserId) {
        throw new Error("Missing user identification");
    }
    if (!mongoose.Types.ObjectId.isValid(String(toUserId))) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }
    if (toUserId === String(req.userId)) {
        return res.status(400).send("Cannot connect with yourself");
    }
    const USER = yield User.findById(toUserId).select("-password -__v").lean();
    if (!USER) {
        return res.status(404).send("User not found");
    }
    const EXISTING_CONNECTION = yield Connection.findOne({
        $or: [
            { fromUserId: req.userId, toUserId: toUserId },
            { fromUserId: toUserId, toUserId: req.userId }
        ]
    });
    if (EXISTING_CONNECTION) {
        return res.status(400).json({ message: "Connection request already exists" });
    }
    console.time("findConnection");
    const CONNECTION = new Connection({
        fromUserId: req.userId,
        toUserId: toUserId,
        status: status
    });
    yield CONNECTION.save();
    console.timeEnd("findConnection");
    res.status(200).json({ message: `Connection ${status}` });
})));
ROUTER.post('/review/:status/:requestId', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, requestId } = req.params;
    const validStatuses = [...CONNECTION_STATUSES].filter(s => s == 'accepted' || s == 'rejected');
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid connection status" });
    }
    if (!req.userId || !requestId) {
        throw new Error("Missing user identification");
    }
    const CONNECTION = yield Connection.findOne({
        _id: requestId,
        toUserId: req.userId,
        status: 'interested'
    });
    if (!CONNECTION) {
        return res.status(404).json({ message: "Connection request not found" });
    }
    CONNECTION.status = status;
    yield CONNECTION.save();
    res.status(200).json({ message: `Connection ${status}` });
})));
ROUTER.get('/requests', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        throw new Error("Missing user identification");
    }
    const REQUESTS = yield Connection.find({
        toUserId: req.userId,
        status: 'interested'
    }).populate('fromUserId', '-password -__v').lean();
    res.status(200).json({ requests: REQUESTS });
})));
ROUTER.get('/connections', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        throw new Error("Missing user identification");
    }
    const CONNECTIONS = yield Connection.find({
        $or: [
            { fromUserId: req.userId, status: 'accepted' },
            { toUserId: req.userId, status: 'accepted' }
        ]
    }).populate('fromUserId', '-password -__v').populate('toUserId', '-password -__v').lean();
    res.status(200).json({ connections: CONNECTIONS });
})));
ROUTER.get('/feed', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        throw new Error("Missing user identification");
    }
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = Math.min(limit, 50);
    const skip = (page - 1) * limit;
    const existingConnections = yield Connection.find({
        $or: [
            { fromUserId: req.userId },
            { toUserId: req.userId }
        ]
    }).select('fromUserId toUserId').lean();
    const excludedUserIds = new Set();
    excludedUserIds.add(String(req.userId));
    existingConnections.forEach(conn => {
        excludedUserIds.add(String(conn.fromUserId));
        excludedUserIds.add(String(conn.toUserId));
    });
    const excludedObjectIds = Array.from(excludedUserIds).map(id => new mongoose.Types.ObjectId(id));
    const feedUsers = yield User.find({
        _id: { $nin: excludedObjectIds }
    })
        .select("-password -__v")
        .skip(skip)
        .limit(limit)
        .lean();
    const totalCount = yield User.countDocuments({
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
})));
export const CONNECTION_ROUTER = ROUTER;
