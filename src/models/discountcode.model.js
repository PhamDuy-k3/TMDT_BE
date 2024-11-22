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
      required: true,
    },
    discountValue: {
      type: Number,
      required: function () {
        return this.discountType !== "freeshipping";
      }, // Không bắt buộc nếu là miễn phí vận chuyển
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage", "freeshipping"],
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
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired"],
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
    maxShippingFreeDiscount: {
      type: Number,
      required: function () {
        return this.discountType === "freeshipping";
      }, // Chỉ bắt buộc nếu là miễn phí vận chuyển
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
