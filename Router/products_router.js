import express from "express";
import ProductController from "../src/controllers/ProductController.js";
import CreateProductMiddleware from "../src/middlewares/products/createProductMiddleware.js";
import UpdateProductMiddleware from "../src/middlewares/products/updateProductMiddleware.js";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";
export const productRouter = (app) => {
  const router = express.Router();
  const productController = new ProductController();

 // router.use(AuthMiddleware);

  router.post(
    "/",
    uploadImage.array("image", 5),
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
    uploadImage.single("image"),
    UpdateProductMiddleware,
    productController.update
  );
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
