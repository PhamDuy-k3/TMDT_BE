import ShippingFee from "../models/shippingFee.model.js";

export default class ShippingFeeController {
  async create(req, res) {
    try {
      const data = req.body;
      const shippingFee = await ShippingFee.create(data);

      if (!shippingFee) {
        return res
          .status(400)
          .json({ error: { message: "Không thể tạo biến thể" } });
      }
      res.status(200).json(shippingFee);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error.message || "Đã xảy ra lỗi máy chủ",
        },
      });
    }
  }

  async index(req, res) {
    try {
      const shippingFees = await ShippingFee.find({});
      res.json({
        data: shippingFees,
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
