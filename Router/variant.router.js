import express from "express";
import VariantController from "../src/controllers/VariantController.js";

export const VariantRouter = (app) => {
  const router = express.Router();

  const variantController = new VariantController();

  router.post("/", variantController.create);
  //   router.get("/:brandId", variantController.show);
  router.get("/", variantController.index);
  router.put("/", variantController.update);
  router.delete("/", variantController.delete);
  app.use("/variants", router);
};
