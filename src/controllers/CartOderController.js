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
  async update(req, res) {
    try {
      const data = req.body;
      const { cartOrderId } = req.params;
      console.log(cartOrderId);
      const cartOrder = await cartOderModel.findById(cartOrderId);

      if (!cartOrder) {
        throw new Error("Đơn hàng trong giỏ hàng không tồn tại");
      }

      const cartOrderUpdate = await cartOderModel.findByIdAndUpdate(
        cartOrderId,
        data,
        {
          new: true,
        }
      );

      res.json({
        data: cartOrderUpdate,
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

  async index(req, res) {
    try {
      const { id_user_oder, status, startDate, endDate } = req.query;
      const conditions = {};

      // Lọc theo ID người dùng
      if (id_user_oder) {
        conditions.id_user_oder = id_user_oder;
      }

      // Lọc theo trạng thái, mặc định bỏ qua đơn hàng đã giao
      conditions.status = status || { $ne: "delivered" };

      // Lọc theo khoảng thời gian
      if (startDate && endDate) {
        conditions.confirmedAt = {
          $gte: new Date(startDate).setHours(0, 0, 0, 0),
          $lte: new Date(endDate).setHours(23, 59, 59, 999),
        };
      } else if (startDate) {
        conditions.confirmedAt = {
          $gte: new Date(startDate).setHours(0, 0, 0, 0),
          $lte: new Date(startDate).setHours(23, 59, 59, 999),
        };
      }
      // lọc theo tháng

      // if (startDate) {
      //   const startOfMonth = new Date(startDate);
      //   startOfMonth.setDate(1); // Đặt ngày thành ngày 1 của tháng
      //   startOfMonth.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày

      //   const startOfNextMonth = new Date(startOfMonth);
      //   startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1); // Chuyển sang tháng tiếp theo

      //   conditions.confirmedAt = {
      //     $gte: startOfMonth,
      //     $lt: startOfNextMonth,
      //   };
      // }

      const carts = await cartOderModel.find(conditions);
      res.json({ data: carts });
    } catch (error) {
      res.status(500).json({ error: { message: error.message } });
    }
  }
}
