import express from "express";
import CategoriesController from "../src/controllers/CategoriesController.js";
import CreateCategoriesMiddleware from "../src/middlewares/categories/createCategoriesMiddleware.js";
import { uploadImageAndVideo } from "../src/middlewares/multer/upload-image.middleware.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";
export const categoriesRouter = (app) => {
  const router = express.Router();

  const categoriesController = new CategoriesController();
  router.use(AuthMiddleware);

  router.post(
    "/",
    uploadImageAndVideo.single("image"),
    CreateCategoriesMiddleware,
    categoriesController.create
  );
  router.get("/",AuthMiddleware, categoriesController.index);
  router.get("/:categorieId", categoriesController.show);
  app.use("/categories", router);
};
