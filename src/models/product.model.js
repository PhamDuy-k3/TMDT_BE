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
    // khi chuyển đổi thành Json thì các hàm getter sẽ được tự động thực thi
    // khi chuyển thành JSON và trả lại client khi gọi api thì image sẽ trả về
    // http://localhost:5050/image
  }
);
export default mongoose.model("Product", productModel, "products");
// liên kết đến db (tên model , cấu trúc model , tên colection)
