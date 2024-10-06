import express from "express";
import { uploadImage } from "../src/middlewares/multer/upload-image.middleware.js";
import CartController from "../src/controllers/CartController.js";
export const cartRouter = (app) => {
  const router = express.Router();
  const cartController = new CartController();

  router.post("/", uploadImage.single("image"), cartController.create);
  router.get("/", cartController.index);

  //   router.get("/:productId", productController.show);

  router.delete("/", cartController.delete);
  router.delete("/:cartId", cartController.deleteCartById);
  router.delete(
    "/deleteCartsByUserId/:userId",
    cartController.deleteCartsByUserId
  );
  router.get(
    "/getCartsByUserIdAndIdProduct",
    cartController.getCartsByUserIdAndIdProduct
  );

  router.put("/:cartId", uploadImage.single("image"), cartController.update);

  app.use("/carts", router);
};
