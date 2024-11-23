import express from "express";
import ProvincesController from "../src/controllers/ProvincesController.js";

export const provincesRouter = (app) => {
  const router = express.Router();

  const provincesController = new ProvincesController();

  router.post("/", provincesController.create);
  //   router.get("/:brandId", provincesController.show);
  router.get("/", provincesController.index);
  app.use("/provinces", router);
};
