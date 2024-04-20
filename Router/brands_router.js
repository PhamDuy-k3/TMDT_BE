import express from "express";
import BrandController from "../src/controllers/BrandsController.js";
import CreateBrandsMiddleware from "../src/middlewares/brands/createBrandsMiddleware.js";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";

export const brandsRouter = (app) => {
  const router = express.Router();

  const brandsController = new BrandController();

  router.post(
    "/",
    uploadImage.single("logo"),
    CreateBrandsMiddleware,
    brandsController.create
  );

  app.use("/brands", router);
};
