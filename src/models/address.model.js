import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    default: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
      trim: true, // Số nhà, tên đường
    },
    town: {
      type: String,
      required: true, // Phường/Xã
      trim: true,
    },
    district: {
      type: String,
      required: true, // Quận/Huyện
      trim: true,
    },
    province: {
      type: String,
      required: true, // Tỉnh/Thành phố
      trim: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

export default mongoose.model("Address", AddressSchema, "address");
