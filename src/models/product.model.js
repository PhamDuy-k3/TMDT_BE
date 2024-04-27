import mongoose from "mongoose";
const productModel = mongoose.Schema(
  {
    // cấu trúc collextion
    name: {
      type: String,
      unique: true,
    },
    prices: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    category_id: {
      type: String,
    },
    brand_id: {
      type: String,
    },
    image: {
      type: String,
      get: function (image) {
        if (image) {
          return "http://localhost:5050/" + image;
        }
      },
    },
  },
  {
    toJSON: { getters: true },
  }
);
export default mongoose.model("Product", productModel, "products");
// liên kết đến db (tên model , cấu trúc model , tên colection)
