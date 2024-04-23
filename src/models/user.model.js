import mongoose from "mongoose";
const userModel = mongoose.Schema(
  {
    // cấu trúc collextion
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    gender: {
      type: Number,
    },
    level: {
      type: Number,
    },
    password: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    address: {
      type: String,
    },
    province_id: {
      type: mongoose.Schema.Types.Mixed, // Chấp nhận cả kiểu dữ liệu chuỗi và số
    },
    district_id: {
      type: mongoose.Schema.Types.Mixed,
    },
    town_id: {
      type: mongoose.Schema.Types.Mixed,
    },
    avatar: {
      type: String,
      get: function (avatar) {
        return "http://localhost:5050/" + avatar;
      },
    },
  },
  {
    toJSON: { getters: true },
  }
);

export default mongoose.model("User", userModel, "users");
// liên kết đến db (tên model , cấu trúc model , tên colection)
