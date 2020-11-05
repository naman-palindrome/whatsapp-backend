import mongoose from "mongoose";
const messageScheme = mongoose.Schema({
  username: String,
  message: String,
  timestamp: String,
  received: Boolean,
});

export default mongoose.model("messages", messageScheme);
