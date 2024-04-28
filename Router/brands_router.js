import express from "express";
import BrandController from "../src/controllers/BrandsController.js";
import CreateBrandsMiddleware from "../src/middlewares/brands/createBrandsMiddleware.js";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";
import brandsModel from "../src/models/brands.model.js";

export const brandsRouter = (app) => {
  const router = express.Router();

  const brandsController = new BrandController();

  router.post(
    "/",
    uploadImage.single("logo"),
    CreateBrandsMiddleware,
    brandsController.create
  );
  router.get("/:brandId", brandsController.show);
  router.get("/", brandsController.index);
  app.use("/brands", router);
};
