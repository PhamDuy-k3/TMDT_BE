import mongoose from "mongoose";

const districtModel = mongoose.Schema({
  provinces_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provinces",
    required: true,
  },
  name: {
    type: String,
    unique: true,
  },
});
export default mongoose.model("Districts", districtModel, "districts");
