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
      const comment = await commentModel.create(data);
      if (!comment) {
        return res.json({
          status_code: 400,
          message: "Create comment fail",
        });
      }
      return res.json({
        status_code: 200,
        data: comment,
      });
    } catch (error) {
      res.status(400).json({
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
      const { productId, rating, limit = 2, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      const conditions = {};
      if (productId) {
        conditions.productId = productId;
      }
      if (rating != 0) {
        conditions.rating = { $eq: rating };
      }
      if (rating === 0) {
        conditions.rating = { $gt: rating };
      }
      const [count, comments] = await Promise.all([
        commentModel.countDocuments(conditions),
        commentModel.find(conditions).limit(limit).skip(offset),
      ]);

      const pagination = Math.ceil(count / limit);
      res.json({
        data: comments,
        status_code: 200,
        count,
        limit: +limit,
        page: +page,
        pagination,
        errors: [],
      });
    } catch (error) {
      res.status(400).json({
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
