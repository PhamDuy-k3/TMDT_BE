import express from "express";
import AuthController from "../src/controllers/AuthController.js";
import LoginMiddleware from "../src/middlewares/auth/login.middleware.js";
export const authRouter = (app) => {
  const router = express.Router();

  const authController = new AuthController();

  router.post('/login', LoginMiddleware, authController.login)

  app.use("/auth", router);
};
