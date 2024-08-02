import cartOderModel from "../models/cartOder.model.js";

export default class CartOderController {
  async create(req, res) {
    try {
      const data = req.body;
      const cart = await cartOderModel.create(data);
      res.json({
        data: cart,
        status_code: 200,
        errors: [],
      });
    } catch (error) {
      res.json(error);
    }
  }
  async index(req, res) {
    try {
      const { id_user_oder } = req.query;
      const conditions = {};
      if (id_user_oder) {
        conditions.id_user_oder = id_user_oder;
      }
      const carts = await cartOderModel.find(conditions);
      res.json({
        data: carts,
      });
    } catch (error) {
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }
}
