import express from "express";
import { uploadImageAndVideo } from "../src/middlewares/multer/upload-image.middleware.js";
import DiscountcodeController from "../src/controllers/DiscountcodeController.js";

export const discountcodeRouter = (app) => {
  const router = express.Router();

  const discountcodeController = new DiscountcodeController();

  router.post(
    "/",
    uploadImageAndVideo.single("logoShop"),
    discountcodeController.create
  );
  router.get("/", discountcodeController.index);

  app.use("/discountcode", router);
};
