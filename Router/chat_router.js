import express from "express";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";
import ChatController from "../src/controllers/ChatController.js";

export const ChatRouter = (app) => {
  const router = express.Router();

  const chatController = new ChatController();

  router.post("/create-chat-room", chatController.create);
  router.post("/send-message", chatController.createMessInRoom);
  router.get("/chat-room/:chatRoomId/messages", chatController.getMessInRoom);
  router.get("/chat-room", chatController.getRoom);
  app.use("/chats", router);
};
