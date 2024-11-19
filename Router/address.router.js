import express from "express";
import AddressController from "../src/controllers/AddressController.js";
import AuthMiddleware from "../src/middlewares/auth/auth.middleware.js";

export const AddressRouter = (app) => {
  const router = express.Router();
  router.use(AuthMiddleware);

  const addressController = new AddressController();

  router.post("/", AuthMiddleware, addressController.create);
  router.put("/:id_address", AuthMiddleware, addressController.update);
  
  router.put(
    "/updateOne/updateOneAddressToTrue/:id_address",
    AuthMiddleware,
    addressController.updateOneAddressToTrue
  );
  router.put(
    "/updateMany/updateAllDefaultAddressesToFalse",
    AuthMiddleware,
    addressController.updateAllDefaultAddressesToFalse
  );
  router.get("/", AuthMiddleware, addressController.index);
  router.get(
    "/getAddressDefaultIsTrue",
    AuthMiddleware,
    addressController.getAddressDefaultIsTrue
  );
  app.use("/address", router);
};
