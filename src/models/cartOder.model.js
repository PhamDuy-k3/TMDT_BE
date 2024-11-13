import mongoose from "mongoose";

const cartOderModel = mongoose.Schema({
  orderId: {
    type: String,
  },
  carts: {
    type: Array,
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
  paymentStatus: {
    type: String,
    enum: [
      "unpaid", // Chưa thanh toán
      "paid", // Đã thanh toán
      "refunded", // Đã hoàn tiền
    ],
    default: "unpaid",
  },
  id_user_oder: {
    type: String,
    required: true,
  },
  total_prices: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
  },
  selectedDiscountCodes: {
    type: Array,
    default: [],
  },
  gmail: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  confirmedAt: {
    type: Date,
  },
  // address: {
  //   type: String,
  //   require: true,
  // },
});

export default mongoose.model("CartOder", cartOderModel, "cartsOder");
