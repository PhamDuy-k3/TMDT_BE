import cartModel from "../models/cart.model.js";

export default class CartController {
  async create(req, res) {
    try {
      const data = req.body;
      data.id_user = req.authUser?._id.toString();
      const file = req.file;
      if (file) {
        data.image = file.filename;
      }

      const cart = await cartModel.create(data);
      res.json({
        data: cart,
        status_code: 200,
        errors: [],
      });
    } catch (error) {
      res.json(error);
    }
  }
  async update(req, res) {
    try {
      const data = req.body;
      const file = req.file;
      if (file) {
        data.image = file.filename;
      }
      const { cartId } = req.params;
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("cart ko tồn tại");
      }
      const cartUpdate = await cartModel.findByIdAndUpdate(cartId, data, {
        new: true,
      });
      res.json({
        data: cartUpdate,
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
  async delete(req, res) {
    try {
      const result = await cartModel.deleteMany({});

      res.json({
        status_code: 200,
        data: {
          deletedCount: result.deletedCount,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }
  async deleteCartById(req, res) {
    try {
      const { cartId } = req.params;

      const result = await cartModel.findByIdAndDelete(cartId);

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
  async deleteCartsByUserId(req, res) {
    try {
      if (req.authUser) {
        const user_id = req.authUser?._id.toString();
        const result = await cartModel.deleteMany({ id_user: user_id });

        res.json({
          status_code: 200,
          data: result,
        });
      }
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
  async getCartsByUserIdAndIdProduct(req, res) {
    try {
      const { ids_product } = req.query;
      const idUser = req.authUser?._id.toString();

      let array = ids_product.split(",");

      const conditions = {};
      if (idUser) {
        conditions.id_user = idUser;
      }
      if (array && array.length > 0) {
        conditions._id = { $in: array };
      }
      const carts = await cartModel.find(conditions);
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
  async index(req, res) {
    try {
      const id_user = req.authUser?._id.toString();
      const conditions = {};
      if (id_user) {
        conditions.id_user = id_user;
      }
      const carts = await cartModel.find(conditions);
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
