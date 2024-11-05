import mongoose from "mongoose";

const userVoucherModel = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voucher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscountcodeModel",
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    received_date: { type: Date, default: Date.now },
    used_date: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User_vouchers",
  userVoucherModel,
  "user_vouchers"
);
