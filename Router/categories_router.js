import express from "express";
import CategoriesController from "../src/controllers/CategoriesController.js";
import CreateCategoriesMiddleware from "../src/middlewares/categories/createCategoriesMiddleware.js";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";
export const categoriesRouter = (app) => {
  const router = express.Router();

  const categoriesController = new CategoriesController();

  router.post(
    "/",
    uploadImage.single("image"),
    CreateCategoriesMiddleware,
    categoriesController.create
  );
  router.get("/", categoriesController.index);
  router.get("/:categorieId", categoriesController.show);
  app.use("/categories", router);
};
