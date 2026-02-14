import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { CORS_URL } from "../configs/constants.js";
import { Logger } from "./logger.js";
import { Chat } from "../models/chat.js";
import crypto from "crypto";

let IO: SocketIOServer;

const getRoomID = (fromID: string, toID: string) => {
  const id = crypto
    .createHash("sha256")
    .update([fromID, toID].sort().join("#"))
    .digest("hex");
  return id;
};

export const initSocket = async (server: Server) => {
  IO = new SocketIOServer(server, {
    cors: {
      origin: CORS_URL,
      credentials: true,
    },
  });

  IO.on("connection", (socket) => {
    socket.on("joinChat", (data) => {
      const ROOM_ID = getRoomID(data.user, data.toId);
      socket.join(ROOM_ID);
    });

    socket.on("sendMessage", async (data) => {
      const ROOM_ID = getRoomID(data.user, data.toId);
      console.log(data.message);
      try {
        let chat = await Chat.findOne({
          participants: { $all: [data.user, data.toId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [data.user, data.toId],
            messages: [],
          });
        }
        chat.messages.push({
          senderId: data.user,
          text: data.message,
        });
        console.log(chat);
        IO.to(ROOM_ID).emit("newMessage", {
          id: data.user,
          message: data.message,
        });
      } catch (error) {
        Logger.error(error);
      }
    });
  });

  return IO;
};

export const getIo = async () => {
  if (!IO) throw new Error("Socket.IO not initialized");
  return IO;
};
