const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    chat: [
      {
        sender: { type: Number, enum: [0, 1] }, // 0: gpt, 1: user
        message: { type: String },
        time: { type: String },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const MessageHistory = mongoose.model("message", messageSchema);
module.exports = MessageHistory;
