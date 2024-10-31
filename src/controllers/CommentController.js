import commentModel from "../models/comment.model.js";

export default class CommentController {
  async create(req, res) {
    try {
      const userId = req.authUser?._id.toString();
      const data = req.body;
      const file = req.file;
      if (userId) {
        data.userId = userId;
      }
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
  async delete(req, res) {
    try {
      const { commentId } = req.params;
      const result = await commentModel.delete(commentId);
      res.json({
        status_code: 200,
        data: result,
      });
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
      const { productId } = req.query;
      const conditions = {};
      if (productId) {
        conditions.productId = productId;
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
  async update(req, res) {
    try {
      const { commentId } = req.params;
      const data = req.body;
      const result = await commentModel.findByIdAndUpdate(commentId, data, {
        new: true,
      });
      res.json({
        data: result,
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
