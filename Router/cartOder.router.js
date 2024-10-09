import express from "express";
import CartController from "../src/controllers/CartController.js";
import CartOderController from "../src/controllers/CartOderController.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";
export const cartOderRouter = (app) => {
  const router = express.Router();
  const cartOderController = new CartOderController();

  router.post("/", AuthMiddleware, cartOderController.create);

  router.get("/", AuthMiddleware, cartOderController.index);
  router.get("/admin", AuthMiddleware, cartOderController.indexAdmin);


  router.get("/:orderId", cartOderController.show);

  router.put("/:cartOrderId", cartOderController.update);

  app.use("/cartsOder", router);
};
