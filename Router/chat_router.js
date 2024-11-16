import express from "express";
import { uploadImageAndVideo } from "../src/middlewares/multer/upload-image.middleware.js";
import ChatController from "../src/controllers/ChatController.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";

export const ChatRouter = (app) => {
  const router = express.Router();

  const chatController = new ChatController();

  router.post("/create-chat-room", AuthMiddleware, chatController.create);

  router.post("/send-message", chatController.createMessInRoom);

  router.get("/chat-room/:chatRoomId/messages", chatController.getMessInRoom);

  router.get("/chat-room", AuthMiddleware, chatController.getRoom);

  router.get("/admin/chat-room", AuthMiddleware, chatController.getRoomAdmin);

  router.post(
    "/admin/create-chat-room",
    AuthMiddleware,
    chatController.admin_create
  );
  app.use("/chats", router);
};
