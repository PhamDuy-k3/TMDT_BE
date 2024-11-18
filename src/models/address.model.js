import mongoose from "mongoose";

const AddressModel = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: { type: String, required: true },
  },
  {
    toJSON: { getters: true },
  }
);
export default mongoose.model("Address", AddressModel, "address");
