import { console } from "node:inspector";
import cartOderModel from "../models/cartOder.model.js";
import productModel from "../models/product.model.js";

import sendOrderConfirmationEmail from "../utils/orderEmail.js";
import { io } from "../../index.js";
import discountcodeModel from "../models/discountcode.model.js";
import User_vouchers from "../models/user_voucher.model.js";
import { abort } from "node:process";
import Variant from "../models/variants.model.js";
import { updateDiscountCodes } from "../utils/updateDiscountCodes.js";
import { updateProductStock } from "../utils/updateProductStock.js";
const confirmationTokens = {};

export default class CartOderController {
  async create(req, res) {
    try {
      const data = req.body;
      const userId = req.authUser?._id.toString();
      if (userId) {
        data.id_user_oder = userId;
      }
      // Tạo đơn hàng
      const cart = await cartOderModel.create(data);
      if (!cart) throw new Error("Không thể tạo đơn hàng");

      const { carts, discountCodes } = data;
      if (carts.length > 0) {
        updateProductStock(carts);
      }
      if (discountCodes.length > 0) {
        updateDiscountCodes(discountCodes, userId);
      }

      // Trả về kết quả thành công
      res.status(201).json({
        data: cart,
        status_code: 201,
        errors: [],
      });

      // Gửi email xác nhận đơn hàng nếu cần
      // await sendOrderConfirmationEmail(cart.gmail, cart);
    } catch (error) {
      res.json(error);
    }
  }

  async show(req, res) {
    try {
      const { orderId } = req.params;
      const order = await cartOderModel.findById(orderId);
      res.json({
        data: order,
      });
    } catch (error) {
      res.json(error);
    }
  }

  async update(req, res) {
    try {
      const data = req.body;
      const { cartOrderId } = req.params;
      const cartOrder = await cartOderModel.findById(cartOrderId);

      if (!cartOrder) {
        return res.status(404).json({
          error: {
            message: "Đơn hàng trong giỏ hàng không tồn tại",
          },
        });
      }

      const cartOrderUpdate = await cartOderModel.findByIdAndUpdate(
        cartOrderId,
        data,
        { new: true }
      );

      res.status(200).json({
        data: cartOrderUpdate,
        status_code: 200,
      });

      if (data.status === "confirmed") {
        const socketId = cartOrder.id_user_oder;
        if (socketId) {
          io.emit("orderConfirmedNotification", cartOrderUpdate);
        }
      }
    } catch (error) {
      console.error("Error updating cart order:", error);
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }

  async index(req, res) {
    try {
      const { status, startDate, endDate, limit = 2, page = 1 } = req.query;

      const conditions = {};
      let sortOption = {};
      const offset = (page - 1) * limit;

      if (status) {
        conditions.status = status;
      }
      // Sắp xếp theo ngày tạo (mới nhất đầu tiên)
      sortOption.createdAt = -1;
      // console.log(new Date(startDate).setHours(0, 0, 0, 0))

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
      const [count, carts] = await Promise.all([
        cartOderModel.countDocuments(conditions),
        cartOderModel
          .find(conditions)
          .limit(limit)
          .skip(offset)
          .sort(sortOption),
        ,
      ]);
      const pagination = Math.ceil(count / limit);

      res.status(200).json({
        data: carts,
        status_code: 200,
        limit: +limit,
        page: +page,
        pagination,
      });
    } catch (error) {
      console.error("Error fetching cart orders:", error);
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }
  async indexAdmin(req, res) {
    try {
      const { status, startDate, endDate } = req.query;
      console.log(startDate, endDate);
      const conditions = {};
      // Lọc theo ID người dùng
      if (status) {
        conditions.status = status;
      }

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

      const carts = await cartOderModel.find(conditions);

      res.status(200).json({ data: carts, status_code: 200 });
    } catch (error) {
      console.error("Error fetching cart orders:", error);
      res.status(500).json({
        error: {
          message: error.message,
        },
      });
    }
  }
  async sendOrderInformationViaEmail(req, res) {
    const orderDetails = req.body;
    // Gửi email xác nhận
    try {
      await sendOrderConfirmationEmail(orderDetails.gmail, orderDetails);
      res
        .status(200)
        .send("Đơn hàng đã được đặt. Vui lòng kiểm tra email để xác nhận.");
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
      res.status(500).json({
        error: {
          message: "Có lỗi xảy ra khi gửi email xác nhận.",
        },
      });
    }
  }
}
