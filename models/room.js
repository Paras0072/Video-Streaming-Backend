const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", roomSchema);
