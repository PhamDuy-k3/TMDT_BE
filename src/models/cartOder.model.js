import mongoose from "mongoose";

const cartOderModel = mongoose.Schema({
  carts: {
    type: Array,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  id_user_oder: {
    type: String,
    required: true,
  },
});

export default mongoose.model("CartOder", cartOderModel, "cartsOder");
