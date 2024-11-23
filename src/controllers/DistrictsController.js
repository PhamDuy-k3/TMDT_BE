import districtsModel from "../models/districts.model.js";

export default class DistrictsController {
  async create(req, res) {
    try {
      const data = req.body;

      const districts = await districtsModel.create(data);

      res.status(200).json(districts);
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
      const { provinces_id } = req.query;
      const districts = await districtsModel.find({
        provinces_id: provinces_id,
      });
      res.json({
        data: districts,
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
