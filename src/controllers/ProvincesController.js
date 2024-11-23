import provincesModel from "../models/provinces.model.js";

export default class ProvincesController {
  async create(req, res) {
    try {
      const data = req.body;

      const provinces = await provincesModel.create(data);

      res.status(200).json(provinces);
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
  async index(req, res) {
    try {
      const provinces = await provincesModel.find({});
      res.json({
        data: provinces,
        status_code: 200,
      });
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
}
