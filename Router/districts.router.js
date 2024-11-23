import express from "express";
import DistrictsController from "../src/controllers/DistrictsController.js";

export const districtsRouter = (app) => {
  const router = express.Router();

  const districtsController = new DistrictsController();

  router.post("/", districtsController.create);
  //   router.get("/:brandId", districtsController.show);
     router.get("/", districtsController.index);
  app.use("/districts", router);
};
