import categoriesModel from "../models/categories.model.js";
export default class CategoriesController {
  async create(req, res) {
    try {
      const data = req.body;
      const file = req.file;
      data.image = file.filename;
      const categories = await categoriesModel.create(data); // đợi cho kết quả dc tra ve
      res.json(categories);
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
