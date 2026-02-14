import { Request, Response, Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/wrapper.js";
import { Chat } from "../models/chat.js";

const ROUTER = Router();
ROUTER.use(userAuth);

ROUTER.get("/all/:targetUserId",asyncHandler(async (req: Request, res: Response) => {
    const { targetUserId } = req.params;
    const userId = req.userId;

    let chats = await Chat.findOne({
        participants: {$all: [userId,targetUserId]}
    }).populate({
        path: 'messages.senderId',
        select: 'firstName lastName'
    })
    if(!chats){
        chats = new Chat({
            participants: [userId,targetUserId],
            messages: []
        })
        await chats.save()
    }
    res.json(chats)
  }),
);

export const CHAT_ROUTER = ROUTER;