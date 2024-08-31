import mongoose from "mongoose";

const commentModel = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name_user: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    color: {
      type: String,
    },
    describe: {
      type: String,
    },
    content: { type: String, required: true },
    image: {
      type: String,
      get: function (image) {
        if (image) {
          return "http://localhost:5050/" + image;
        }
      },
    },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { getters: true },
  }
);

export default mongoose.model("Comments", commentModel, "comments");
