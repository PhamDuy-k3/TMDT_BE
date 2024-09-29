import express from "express";
import UserController from "../src/controllers/UserController.js";
import CreateUserMiddleware from "../src/middlewares/users/createUserMiddleware.js";
import UpdateUserMiddleware from "../src/middlewares/users/updateUserMiddleware.js";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";

export const userRouter = (app) => {
  const router = express.Router();
  const userController = new UserController();

  //router.use(AuthMiddleware);

  router.post(
    "/",
    uploadImage.single("avatar"),
    CreateUserMiddleware,
    userController.create
  );
  router.get("/:userId", userController.show);
  router.put(
    "/:userId",
    uploadImage.single("avatar"),
    UpdateUserMiddleware,
    userController.update
  );
  router.delete("/:userId", userController.delete);
  //danh sách user
  router.get("/", userController.index);
  app.use("/users", router);
};
