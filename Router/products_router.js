import express from "express";
import ProductController from "../src/controllers/ProductController.js";
import CreateProductMiddleware from "../src/middlewares/products/createProductMiddleware.js";
import UpdateProductMiddleware from "../src/middlewares/products/updateProductMiddleware.js";
import { uploadImageAndVideo } from "../src/middlewares/multer/upload-image.middleware.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";
export const productRouter = (app) => {
  const router = express.Router();
  const productController = new ProductController();

   router.use(AuthMiddleware);

  router.post(
    "/",
    uploadImageAndVideo.fields([
      { name: "images", maxCount: 4 },
      { name: "videos", maxCount: 1 },
    ]),
    CreateProductMiddleware,
    productController.create
  );
  router.get("/", productController.index);

  router.get("/admin", productController.indexAdmin);

  router.get("/carts", productController.getProductsInCarts);

  router.get("/:productId", AuthMiddleware, productController.show);

  router.delete("/:productId", productController.delete);

  router.put(
    "/:productId",
    uploadImageAndVideo.fields([
      { name: "images", maxCount: 4 },
      { name: "videos", maxCount: 1 },
    ]),
    UpdateProductMiddleware,
    productController.update
  );
  router.put("/isVisible/:productId", productController.updateIsVisible);
  router.put(
    "/increaseLike/:productId",
    AuthMiddleware,
    productController.updateIncreaseLike
  );
  router.put(
    "/decreaseLike/:productId",
    AuthMiddleware,
    productController.updateDecreaseLike
  );

  app.use("/products", router);
};
