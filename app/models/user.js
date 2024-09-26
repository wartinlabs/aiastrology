const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone_no: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: Number,
    },
    image: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    date_of_birth: {
      type: Date,
    },
    time_of_birth: {
      type: String,
    },
    place_of_birth: {
      type: String,
    },
    country: {
      type: String,
    },
    balance: {
      type: String,
    },
    notification_token: {
      type: String,
      default: null,
    },
    phone_no_verified: {
      type: Boolean,
      default: false,
    },
    delete_account: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
