import mongoose from "mongoose";

const AddressModel = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  default: {
    type: Boolean,
    default: false,
  },
  address: { type: String, required: true, unique: true, trim: true },
});
export default mongoose.model("Address", AddressModel, "address");
