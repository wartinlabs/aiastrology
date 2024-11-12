const mongoose = require("mongoose");

const purchasePackageSchema = new mongoose.Schema(
  {
    time: {
      type: Number, // seconds
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const PurchasePackage = mongoose.model(
  "purchase-package",
  purchasePackageSchema
);
module.exports = PurchasePackage;
