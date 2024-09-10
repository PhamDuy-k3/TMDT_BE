import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
  sender: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
});

export default mongoose.model("Message", messageSchema, "messages");
