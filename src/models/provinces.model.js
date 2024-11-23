import mongoose from "mongoose";

const provincesModel = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});
export default mongoose.model("Provinces", provincesModel, "provinces");