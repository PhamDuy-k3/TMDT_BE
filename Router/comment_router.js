import express from "express";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";
import CommentController from "../src/controllers/CommentController.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";

export const commentRouter = (app) => {
  const router = express.Router();

  const commentController = new CommentController();

  router.post(
    "/",
    uploadImage.single("image"),
    AuthMiddleware,
    commentController.create
  );
  router.get("/", AuthMiddleware, commentController.index);
  app.use("/comments", router);
};
