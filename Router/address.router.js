import express from "express";
import AddressController from "../src/controllers/AddressController.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";

export const AddressRouter = (app) => {
  const router = express.Router();
  router.use(AuthMiddleware);

  const addressController = new AddressController();

  router.post("/",AuthMiddleware, addressController.create);

  router.get("/",AuthMiddleware, addressController.index);
  app.use("/address", router);
};
