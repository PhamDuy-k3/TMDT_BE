import express from "express";
import SizeController from "../src/controllers/SizeController.js";

export const SizeRouter = (app) => {
  const router = express.Router();

  const sizeController = new SizeController();

  router.post("/", sizeController.create);
  //   router.get("/:brandId", sizeController.show);
    router.get("/", sizeController.index);

  app.use("/sizes", router);
};
