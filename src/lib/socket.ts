import { Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { CORS_URL } from "../configs/constants.js";

let IO: SocketIOServer;

export const initSocket = async (server: Server) => {
  IO = new SocketIOServer(server, {
    cors: {
      origin: CORS_URL,
      credentials: true,
    },
  });

  return IO;
};

export const getIo = async () => {
  if (!IO) throw new Error("Socket.IO not initialized");
  return IO;
};
