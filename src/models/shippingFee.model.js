import mongoose from "mongoose";

const shippingFeeModel = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Hỏa tốc", "Nhanh", "Thường"],
      required: true,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    deliveryTime: {
      type: String,
      enum: ["1-2 ngày", "3-5 ngày", "5-7 ngày"],
      default: "5-7 ngày",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("ShippingFee", shippingFeeModel, "shippingFees");
