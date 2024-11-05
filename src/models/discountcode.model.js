import mongoose from "mongoose";

const discountcodeModel = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    logoShop: {
      type: String,
      get: function (logoShop) {
        if (logoShop) {
          return "http://localhost:5050/" + logoShop;
        }
      },
    },
    discountValue: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    usedPercentage: {
      type: Number,
      default: 0,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["active", "expired", "used"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    stock: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    toJSON: { getters: true },
  }
);

export default mongoose.model(
  "DiscountcodeModel",
  discountcodeModel,
  "discountcodes"
);
