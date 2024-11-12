const mongoose = require("mongoose");

const historyCallSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    start_time: {
      type: Date,
      default: new Date(),
    },
    end_time: {
      type: Date,
      default: new Date(),
    },
    time: {
      type: Number, // in seconds
      default: 0,
    },
    status: {
      type: String,
      enum: ["Starting", "AutoClosed", "Closed"],
      default: "Starting",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const HistoryCall = mongoose.model("history-call", historyCallSchema);
module.exports = HistoryCall;
