import mongoose from "mongoose";

const cartOderModel = mongoose.Schema({
  carts: {
    type: Array,
    required: true,
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
