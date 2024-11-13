import mongoose from "mongoose";

const variantModel = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
});

export default mongoose.model("Variant", variantModel, "variants");
