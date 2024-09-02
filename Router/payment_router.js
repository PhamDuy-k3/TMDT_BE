import express from "express";
import PaymentController from "../src/controllers/PaymentController.js";

export const paymentRouter = (app) => {
  const router = express.Router();
  const paymentController = new PaymentController();

  router.post("/", paymentController.create);

  router.post("/payment-result", paymentController.handlePaymentResult);

  app.use("/payment", router);
};
