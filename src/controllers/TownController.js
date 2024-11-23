import townsModel from "../models/towns.model.js";

export default class TownsController {
  async create(req, res) {
    try {
      const data = req.body;

      const towns = await townsModel.create(data);

      res.status(200).json(towns);
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
      const { provinces_id, districts_id } = req.query;
      const towns = await townsModel.find({
        provinces_id: provinces_id,
        districts_id: districts_id,
      });
      res.json({
        data: towns,
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
