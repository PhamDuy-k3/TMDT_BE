import express from "express";
import PaymentController from "../src/controllers/PaymentController.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";

export const paymentRouter = (app) => {
  const router = express.Router();
  const paymentController = new PaymentController();

  router.post("/", AuthMiddleware, paymentController.create);
  router.post("/callBack", paymentController.useCallback);
  router.get("/checkOrderStatus", paymentController.checkOrderStatus);
  app.use("/payment", router);
};
