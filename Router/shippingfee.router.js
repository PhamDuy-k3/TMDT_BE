import express from "express";
import ShippingFeeController from "../src/controllers/ShippingFeeController.js";

export const ShippingFeeRouter = (app) => {
  const router = express.Router();

  const shippingFeeController = new ShippingFeeController();

  router.post("/", shippingFeeController.create);
  router.get("/", shippingFeeController.index);

  app.use("/shippingfees", router);
};
