const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    purchasePackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "purchase-package",
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Success", "Failed", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const History = mongoose.model("history", historySchema);
module.exports = History;
