import mongoose from "mongoose";

const cartOderModel = mongoose.Schema({
  orderId: {
    type: String,
  },
  id_user_oder: {
    type: String,
    required: true,
  },
  carts: {
    type: Array,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  shippingFee: {
    type: Number,
    default: 0,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  selectedDiscountCodes: {
    type: Array,
    default: [],
  },
  note: {
    type: String,
  },
  gmail: {
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: ["Momo", "Thanh toán khi nhận hàng"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: [
      "unpaid", // Chưa thanh toán
      "paid", // Đã thanh toán
      "refunded", // Đã hoàn tiền
    ],
    default: "unpaid",
  },
  deliveryMethod: {
    type: String,
    enum: ["Hỏa tốc", "Nhanh", "Thường"],
    default: "Thường",
  },
  status: {
    type: String,
    enum: [
      "unconfirmed", // Chưa xác nhận
      "confirmed", // Đã xác nhận
      "processing", // Đang xử lý
      "shipped", // Đã giao hàng
      "delivered", // Đã giao thành công
      "canceled", // Đã hủy
      "returned", // Đã trả hàng
    ],
    required: true,
    default: "unconfirmed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  confirmedAt: {
    type: Date,
  },
});

export default mongoose.model("CartOder", cartOderModel, "cartsOder");
