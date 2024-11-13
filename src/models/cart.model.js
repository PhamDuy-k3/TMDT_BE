import mongoose from "mongoose";

const cartModel = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.Mixed,
  },
  name: {
    type: String,
    required: true,
    uppercase: true,
  },
  id_user: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  discount_code: {
    type: String,
    default: "0",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
  },
  sum: {
    type: Number,
  },
  image: {
    type: String,
  },
});

export default mongoose.model("Cart", cartModel, "carts");
