import categoriesModel from "../models/categories.model.js";
export default class CategoriesController {
  async create(req, res) {
    try {
      const data = req.body;
      const file = req.file;
      if (file) {
        data.image = file.filename;
      }
      const categories = await categoriesModel.create(data);
      res.json(categories);
    } catch (error) {
      res.json(error);
    }
  }
  async show(req, res) {
    try {
      const { categorieId } = req.params;
      const categorie = await categoriesModel.findById(categorieId);
      res.json({
        data: categorie,
      });
    } catch (error) {
      res.json(error);
    }
  }
  async index(req, res) {
    try {
      const categories = await categoriesModel.find({});
      res.json({
        data: categories,
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
