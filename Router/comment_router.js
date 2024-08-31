import express from "express";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";
import CommentController from "../src/controllers/CommentController.js";

export const commentRouter = (app) => {
  const router = express.Router();

  const commentController = new CommentController();

  router.post("/", uploadImage.single("image"), commentController.create);
  router.get("/", commentController.index);
  app.use("/comments", router);
};
