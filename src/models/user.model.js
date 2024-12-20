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
      default: 2,
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
    isVerified: { type: Boolean, default: false },
    codeExpired: {
      type: Date,
    },
    verificationCode: { type: String },
    avatar: {
      type: String,
      get: function (avatar) {
        if (avatar) {
          return "http://localhost:5050/" + avatar;
        }
      },
    },
  },
  {
    toJSON: { getters: true },
  }
);

export default mongoose.model("User", userModel, "users");
// liên kết đến db (tên model , cấu trúc model , tên colection)
