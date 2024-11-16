import express from "express";
import { uploadImageAndVideo } from "../src/middlewares/multer/upload-image.middleware.js";
import CartController from "../src/controllers/CartController.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";

export const cartRouter = (app) => {
  const router = express.Router();
  const cartController = new CartController();

  router.post(
    "/",
    uploadImageAndVideo.single("image"),
    AuthMiddleware,
    cartController.create
  );
  router.get("/cartUser", AuthMiddleware, cartController.index);

  //   router.get("/:productId", productController.show);

  router.delete("/", cartController.delete);

  router.delete("/:cartId", cartController.deleteCartById);

  router.delete(
    "/user/deleteCartUser",
    AuthMiddleware,
    cartController.deleteCartsByUserId
  );

  router.get(
    "/getCartsByUserIdAndIdProduct",
    AuthMiddleware,
    cartController.getCartsByUserIdAndIdProduct
  );

  router.put(
    "/:cartId",
    uploadImageAndVideo.single("image"),
    cartController.update
  );
  router.put(
    "/updateInfor/cart",
    uploadImageAndVideo.single("image"),
    cartController.updateInfor
  );

  app.use("/carts", router);
};
