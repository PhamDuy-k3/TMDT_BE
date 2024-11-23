import express from "express";
import TownsController from "../src/controllers/TownController.js";

export const townsRouter = (app) => {
  const router = express.Router();

  const townsController = new TownsController();

  router.post("/", townsController.create);
  //   router.get("/:brandId", townsController.show);
  router.get("/", townsController.index);
  app.use("/towns", router);
};
