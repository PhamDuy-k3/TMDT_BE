// refreshTokenModel.js
import mongoose from "mongoose";

const refreshTokenModel = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  refreshToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30d",
  },
});

export default mongoose.model(
  "RefreshToken",
  refreshTokenModel,
  "refreshTokens"
);
