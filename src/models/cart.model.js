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
  },
  color: {
    type: String,
    required: true,
  },
  discount_code: {
    type: String,
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
    required: true,
  },
  sum: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

export default mongoose.model("Cart", cartModel, "carts");
