import mongoose from "mongoose";

const brandsModel = mongoose.Schema(
  {
    // cấu trúc collextion
    name: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
      get: function (logo) {
        return "http://localhost:5050/" + logo;
      },
    },
  },
  {
    toJSON: { getters: true },
  }
);
export default mongoose.model("Brands", brandsModel, "brands");
// liên kết đến db (tên model , cấu trúc model , tên colection)
