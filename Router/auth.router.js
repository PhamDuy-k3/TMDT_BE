import express from "express";
import AuthController from "../src/controllers/AuthController.js";
import LoginMiddleware from "../src/middlewares/auth/login.middleware.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";
export const authRouter = (app) => {
  const router = express.Router();

  const authController = new AuthController();

  router.post("/login", LoginMiddleware, authController.login);

  router.post("/register", authController.register);

  router.get("/checkToken", AuthMiddleware, authController.checkToken);
  
  router.put("/verify/:userId", authController.verify);

  app.use("/auth", router);
};
