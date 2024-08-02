import express from "express";
import CartController from "../src/controllers/CartController.js";
import CartOderController from "../src/controllers/CartOderController.js";
export const cartOderRouter = (app) => {
  const router = express.Router();
  const cartOderController = new CartOderController();

  router.post("/", cartOderController.create);
  router.get("/", cartOderController.index);

  app.use("/cartsOder", router);
};
