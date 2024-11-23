import mongoose from "mongoose";

const townModel = mongoose.Schema({
  provinces_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provinces",
    required: true,
  },
  districts_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Districts",
    required: true,
  },
  name: {
    type: String,
    unique: true,
  },
});
export default mongoose.model("Towns", townModel, "towns");
