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
