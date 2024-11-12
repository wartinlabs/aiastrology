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
    callingCode: {
      type: String,
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
    timeBalance: {
      type: Number, // seconds
      default: 0,
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
    rashi: {
      type: Object,
    },
    day: { type: Number },
    hour: { type: Number },
    lat: { type: Number },
    lon: { type: Number },
    min: { type: Number },
    month: { type: Number },
    year: { type: Number },
    tzone: { type: Number },
    status: {
      type: Number,
      enum: [0, 1], // 0: offline, 1: online
      default: 0,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
