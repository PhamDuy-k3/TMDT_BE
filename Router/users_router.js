import express from "express";
import UserController from "../src/controllers/UserController.js";
import CreateUserMiddleware from "../src/middlewares/users/createUserMiddleware.js";
import UpdateUserMiddleware from "../src/middlewares/users/updateUserMiddleware.js";
import { uploadImageAndVideo } from "../src/middlewares/multer/upload-image.middleware.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";

export const userRouter = (app) => {
  const router = express.Router();
  const userController = new UserController();

  // router.use(AuthMiddleware);

  router.post(
    "/",
    uploadImageAndVideo.single("avatar"),
    CreateUserMiddleware,
    userController.create
  );
  router.get("/:userId", userController.show);

  router.put(
    "/:userId",
    uploadImageAndVideo.single("avatar"),
    UpdateUserMiddleware,
    userController.update
  );

  router.put(
    "/update/user",
    uploadImageAndVideo.single("avatar"),
    UpdateUserMiddleware,
    userController.update_user
  );
  router.delete("/:userId", userController.delete);
  //danh sách user

  router.get("/", userController.index);

  // profile user
  router.get("/profile/user", userController.profile);

  app.use("/users", router);
};
