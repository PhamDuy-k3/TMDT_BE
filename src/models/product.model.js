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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    stock: {
      type: Number,
    },
    soldCount: { type: Number, default: 0 },
    
    description: { type: String },

    isVisible: { type: Boolean, default: false },
    images: [
      {
        type: String,
        get: function (images) {
          if (images) {
            return "http://localhost:5050/" + images;
          }
        },
      },
    ],
    videos: [
      {
        type: String,
        get: function (videos) {
          if (videos) {
            return "http://localhost:5050/" + videos;
          }
        },
      },
    ],
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
