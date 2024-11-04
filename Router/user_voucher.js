import express from "express";
import UserVoucherController from "../src/controllers/UserVoucherController.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";

export const UserVoucherRouter = (app) => {
  const router = express.Router();

  const userVoucherController = new UserVoucherController();

  router.post("/", AuthMiddleware, userVoucherController.create);
  router.get("/", AuthMiddleware, userVoucherController.index);

  app.use("/user_voucher", router);
};
