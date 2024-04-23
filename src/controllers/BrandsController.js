import brandsModel from "../models/brands.model.js";

export default class BrandController {
  async create(req, res) {
    try {
      const data = req.body;
      const file = req.file;
      data.logo = file.filename;
      const brands = await brandsModel.create(data);
      res.json(brands);
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
}
