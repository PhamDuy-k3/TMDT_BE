import mongoose from "mongoose";

const cartOderModel = mongoose.Schema({
  carts: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    enum: ["unconfirmed", "confirmed", "delivered"],
    required: true,
    default: "unconfirmed",
  },
  id_user_oder: {
    type: String,
    required: true,
  },
  total_prices: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  confirmedAt: {
    type: Date,
  },
  // address: {
  //   type: String,
  //   require: true,
  // },
});

export default mongoose.model("CartOder", cartOderModel, "cartsOder");
