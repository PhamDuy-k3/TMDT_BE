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
  async show(req, res) {
    try {
      const { brandId } = req.params;
      const brand = await brandsModel.findById(brandId);
      res.json({
        data: brand,
      });
    } catch (error) {
      res.json(error);
    }
  }
  async index(req, res) {
    try {
      const brands = await brandsModel.find({});
      res.json({
        data: brands,
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
