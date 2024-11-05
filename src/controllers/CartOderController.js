import { console } from "node:inspector";
import cartOderModel from "../models/cartOder.model.js";
import productModel from "../models/product.model.js";

import sendOrderConfirmationEmail from "../utils/orderEmail.js";
import { io } from "../../index.js";
import discountcodeModel from "../models/discountcode.model.js";
import User_vouchers from "../models/user_voucher.model.js";
import { abort } from "node:process";
const confirmationTokens = {};

export default class CartOderController {
  async create(req, res) {
    try {
      const data = req.body;
      if (req.authUser) {
        data.id_user_oder = req.authUser._id.toString();
      }

      // Tạo đơn hàng
      const cart = await cartOderModel.create(data);
      if (!cart) throw new Error("Không thể tạo đơn hàng");

      const { carts, selectedDiscountCodes = [] } = data;

      // Chuẩn bị các thao tác cập nhật mã giảm giá
      const discountUpdatePromises = selectedDiscountCodes.map(async (code) => {
        //giảm số lượng voucher trong kho
        const discountCode = await discountcodeModel.findOne({ code });
        if (!discountCode) {
          throw new Error(`Mã giảm giá ${code} không hợp lệ`);
        }
        if (discountCode.stock > 0) {
          await discountcodeModel.updateOne(
            { code: code },
            { $inc: { stock: -1 } }
          );
        }
        // giảm số lượng dùng voucher của user
        const _id = discountCode._id;
        const voucher_user = await User_vouchers.findOne({
          voucher_id: _id,
        });
        if (voucher_user && voucher_user.quantity > 0) {
          await User_vouchers.updateOne(
            { voucher_id: _id },
            { $inc: { quantity: -1 } }
          );
        }
      });

      // Chuẩn bị các thao tác cập nhật sản phẩm
      const stockUpdatePromises = carts.map(async ({ _id, quantity }) => {
        const product = await productModel.findById(_id);
        if (!product) {
          throw new Error(`Sản phẩm với ID ${_id} không tồn tại`);
        }
        if (product.stock < quantity) {
          throw new Error(`Sản phẩm ${product.name} không đủ số lượng`);
        }
        return productModel.findByIdAndUpdate(
          _id,
          { $inc: { stock: -quantity } },
          { new: true }
        );
      });

      // Chờ các cập nhật hoàn tất
      await Promise.all([...discountUpdatePromises, ...stockUpdatePromises]);

      // Trả về kết quả thành công
      res.status(201).json({
        data: cart,
        status_code: 201,
        errors: [],
      });

      // Gửi email xác nhận đơn hàng nếu cần
      // await sendOrderConfirmationEmail(cart.gmail, cart);
    } catch (error) {
      console.error("Error creating cart order:", error.message);
      res.status(error.message.includes("số lượng") ? 400 : 500).json({
        error: {
          message: error.message.includes("số lượng")
            ? error.message
            : "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.",
        },
      });
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
      const { status, startDate, endDate } = req.query;

      const conditions = {};

      if (status) {
        conditions.status = status;
      }
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
