import axios from "axios";
import crypto from "crypto";
import mongoose from "mongoose";
import cartOderModel from "../models/cartOder.model.js";
import { updateDiscountCodes } from "../utils/updateDiscountCodes.js";
import { updateProductStock } from "../utils/updateProductStock.js";

export default class PaymentController {
  async create(req, res) {
    try {
      const id_user_oder = req.authUser?._id.toString();
      const {
        amount,
        paymentMethod,
        gmail,
        carts,
        note,
        orderInfo,
        selectedDiscountCodes,
        shippingAddress,
        deliveryMethod,
        shippingFee,
        shipping_fee_new,
        subTotal,
      } = req.body;

      // Các thông tin từ MoMo
      const accessKey = "F8BBA842ECF85";
      const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      const partnerCode = "MOMO";
      const redirectUrl = "http://localhost:3000/CartOder";
      const ipnUrl =
        "https://9152-116-96-44-242.ngrok-free.app/payment/callBack";
      const requestType = "payWithMethod";
      const orderId = partnerCode + new Date().getTime();
      const requestId = orderId;
      const extraData = "";
      const orderGroupId = "";
      const autoCapture = true;
      const lang = "vi";

      // Tạo chữ ký (signature) cho request
      const rawSignature =
        `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
        `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
        `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
        `&requestId=${requestId}&requestType=${requestType}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      const newOrder = {
        orderId,
        id_user_oder,
        carts,
        subTotal, // Tổng tiền trước giảm giá
        orderTotal: amount, // Tổng tiền cuối cùng
        selectedDiscountCodes,
        note,
        gmail,
        shippingAddress,
        shippingFee,
        shipping_fee_new,
        paymentMethod: "Momo",
        deliveryMethod,
        status: "unconfirmed",
      };
      const cart = await cartOderModel.create(newOrder);
      if (!cart) throw new Error("Không thể tạo đơn hàng");

      if (selectedDiscountCodes?.length > 0) {
        updateDiscountCodes(selectedDiscountCodes, userId);
      }
      if (carts?.length > 0) {
        updateProductStock(carts);
      }
      // Tạo request body cho MoMo
      const requestBody = {
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        orderGroupId,
        signature,
        paymentMethod, // Chỉ định phương thức thanh toán
      };

      // Gửi yêu cầu đến MoMo API
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (result.resultCode === 0) {
        // Trả về URL thanh toán
        res.status(200).json({ payUrl: result.payUrl });
      } else {
        res.status(400).json({ message: "Payment initiation failed", result });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  // Callback sau khi thanh toán hoàn tất
  async useCallback(req, res) {
    try {
      // Lấy kết quả thanh toán
      const { orderId, resultCode } = req.body;
      console.log(orderId, resultCode)
      // Cập nhật trạng thái đơn hàng dựa trên kết quả thanh toán
      const order = await cartOderModel.findOne({ orderId });
      if (order) {
        if (resultCode === 0) {
          // Thanh toán thành công
          order.paymentStatus = "paid";
          order.status = "processing";
          order.confirmedAt = new Date();
          await order.save();
          res.status(200).json({ message: "Payment successful" });
        } else {
          // Thanh toán thất bại
          order.paymentStatus = "unpaid";
          await order.save();
          res.status(400).json({ message: "Payment failed" });
        }
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      console.error("Error in callback:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  // Kiểm tra trạng thái đơn hàng từ MoMo
  async checkOrderStatus(req, res) {
    try {
      const { orderId } = req.body;
      const requestId = orderId;

      // Các thông tin cần thiết từ MoMo
      const partnerCode = "MOMO";
      const accessKey = "F8BBA842ECF85";
      const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      const lang = "vi";

      // Tạo chữ ký (signature) cho request
      const rawSignature =
        `accessKey=${accessKey}&orderId=${orderId}` +
        `&partnerCode=${partnerCode}&requestId=${requestId}`;

      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

      // Tạo request body cho MoMo
      const requestBody = {
        partnerCode,
        requestId,
        orderId,
        lang,
        signature,
      };

      // Gửi request kiểm tra trạng thái đến MoMo API
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/query",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (result.resultCode === 0) {
        res.status(200).json({ status: "success", data: result });
      } else {
        res.status(400).json({ status: "failed", message: result.message });
      }
    } catch (error) {
      console.error("Error checking order status:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
}
