import mongoose from "mongoose";

const userVoucherSchema = mongoose.Schema(
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
    received_date: { type: Date, default: Date.now },
    used_date: { type: Date },
    status: {
      type: String,
      enum: ["unused", "used", "expired"],
      default: "unused",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User_vouchers",
  userVoucherSchema,
  "user_vouchers"
);
