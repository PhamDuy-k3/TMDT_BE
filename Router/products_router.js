import express from "express";
import ProductController from "../src/controllers/ProductController.js";
import CreateProductMiddleware from "../src/middlewares/products/createProductMiddleware.js";
import UpdateProductMiddleware from "../src/middlewares/products/updateProductMiddleware.js";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";
export const productRouter = (app) => {
  const router = express.Router();
  const productController = new ProductController();

  router.post(
    "/",
    uploadImage.single("image"),
    CreateProductMiddleware,
    productController.create
  );
  router.get("/", productController.index);
  router.get("/:productId", productController.show);
  router.get("/:productId", UpdateProductMiddleware, productController.update);
  app.use("/products", router);
};
