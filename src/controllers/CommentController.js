import commentModel from "../models/comment.model.js";

export default class CommentController {
  async create(req, res) {
    try {
      const data = req.body;
      const file = req.file;
      if (file) {
        data.image = file.filename;
      }
      const discountcodes = await commentModel.create(data);
      res.json(discountcodes);
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
      const { productId, userId } = req.query;
      const conditions = {};
      if (productId) {
        conditions.productId = productId;
      }
      if (userId) {
        conditions.userId = userId;
      }
      const comments = await commentModel.find(conditions);
      res.json({
        data: comments,
        status_code: 200,
        errors: [],
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
