import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { getters: true },
  }
);

export default mongoose.model("Size", sizeSchema, "sizes");
