import mongoose from "mongoose";
const categoriesModel = mongoose.Schema(
  {
    // cấu trúc collextion
    name: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      get: function (image) {
        return "http://localhost:5050/" + image;
      },
    },
  },
  {
    toJSON: { getters: true },
  }
);
export default mongoose.model("Categories", categoriesModel, "categories");
// liên kết đến db (tên model , cấu trúc model , tên colection)
